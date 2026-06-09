import { create } from "zustand";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useCompanyDNAStore } from "./useCompanyDNAStore";
import { useStore } from "../../store";

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  status: "empty" | "in-progress" | "complete";
  wordCount?: number;
}

export interface DocumentState {
  id: string;
  title: string;
  companyName: string;
  type: string;
  originalPrompt?: string;
  sections: DocumentSection[];
  sectionOrder?: string[];
  templateId?: string;
  industry?: string;
  category?: string;
}

interface DocumentStore {
  documents: DocumentState[];
  document: DocumentState | null;
  activeSectionId: string | null;
  investorView: boolean;
  isLoading: boolean;
  history: Array<{ sectionId: string; content: string }[]>;
  loadAllDocuments: () => Promise<void>;
  loadDocument: (id: string) => Promise<void>;
  createDocumentFromTemplate: (templateId: string, template: any) => Promise<string>;
  setActiveSection: (id: string) => void;
  updateSection: (id: string, content: string) => void;
  saveSectionToFirestore: (
    docId: string,
    id: string,
    content: string,
    status: string
  ) => Promise<void>;
  setInvestorView: (view: boolean) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  addSection: (title: string) => void;
  undoAction: (docId: string) => void;
}

// In-memory cache for fast switching during session
const docCache: Record<string, DocumentState> = {};
const saveTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  document: null,
  activeSectionId: null,
  investorView: false,
  isLoading: false,
  history: [],

  loadAllDocuments: async () => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) {
        set({ documents: [], isLoading: false });
        return;
      }
      const q = collection(db, "users", user.uid, "documents");
      const snap = await getDocs(q);
      const docs: DocumentState[] = [];
      snap.forEach((d) => {
        const data = d.data() as DocumentState;
        // Ensure minimal sane defaults so later code never sees undefined
        const safe: DocumentState = {
          id: data.id || d.id,
          title: (data as any).title || (data as any).name || "Untitled",
          companyName: data.companyName || "My Company",
          type: (data as any).type || (data as any).document_type || "Custom",
          originalPrompt: data.originalPrompt,
          sections:
            Array.isArray(data.sections) && data.sections.length > 0
              ? data.sections
              : [
                  {
                    id: "1",
                    title: "Introduction",
                    content: "",
                    status: "empty",
                  },
                ],
          sectionOrder:
            Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
              ? data.sectionOrder
              : (Array.isArray(data.sections) && data.sections.length > 0
                  ? data.sections.map((s) => s.id)
                  : ["1"]),
          templateId: data.templateId,
          industry: data.industry,
          category: data.category,
        };
        docs.push(safe);
        docCache[d.id] = safe;
      });

      // Defensive sort: handle missing or legacy names
      docs.sort((a, b) => {
        const aName = (a.title || (a as any).name || "Untitled").toString();
        const bName = (b.title || (b as any).name || "Untitled").toString();
        return aName.localeCompare(bName);
      });

      set({ documents: docs, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  loadDocument: async (id) => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const docRef = doc(db, "users", user.uid, "documents", id);
      const snap = await getDoc(docRef);

      let docData: DocumentState;
      if (snap.exists()) {
        const raw = snap.data() as any;

        const title =
          typeof raw.title === "string" && raw.title.trim().length > 0
            ? raw.title
            : typeof raw.name === "string" && raw.name.trim().length > 0
            ? raw.name
            : "Untitled";

        const companyName =
          typeof raw.companyName === "string" && raw.companyName.trim().length > 0
            ? raw.companyName
            : "My Company";

        const type =
          typeof raw.type === "string" && raw.type.trim().length > 0
            ? raw.type
            : typeof raw.document_type === "string" &&
              raw.document_type.trim().length > 0
            ? raw.document_type
            : "Custom";

        // Load sections from subcollection
        const sectionsSnap = await getDocs(
          collection(db, "users", user.uid, "documents", id, "sections")
        );
        const subSections: Record<string, DocumentSection> = {};
        sectionsSnap.forEach((s) => {
          const secRaw = s.data() as any;
          const safeSection: DocumentSection = {
            id: secRaw.id || s.id,
            title: secRaw.title || "Untitled Section",
            content: secRaw.content || "",
            status:
              secRaw.status === "in-progress" || secRaw.status === "complete"
                ? secRaw.status
                : "empty",
            wordCount: typeof secRaw.wordCount === "number" ? secRaw.wordCount : undefined,
          };
          subSections[s.id] = safeSection;
        });

        // Resolve sections using sectionOrder, fallback to legacy document.sections
        let finalSections: DocumentSection[] = [];
        if (Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0) {
          raw.sectionOrder.forEach((secId: string) => {
            if (subSections[secId]) finalSections.push(subSections[secId]);
          });
        } else if (Array.isArray(raw.sections) && raw.sections.length > 0) {
          // Legacy support: sections embedded in document
          finalSections = (raw.sections as any[]).map((s, idx): DocumentSection => ({
            id: s.id || `s-${idx}`,
            title: s.title || "Untitled Section",
            content: s.content || "",
            status:
              s.status === "in-progress" || s.status === "complete"
                ? s.status
                : "empty",
          }));
        }

        if (finalSections.length === 0) {
          finalSections = [
            { id: "1", title: "Introduction", content: "", status: "empty" },
          ];
        }

        const sectionOrder =
          Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0
            ? raw.sectionOrder
            : finalSections.map((s) => s.id);

        docData = {
          id,
          title,
          companyName,
          type,
          originalPrompt: raw.originalPrompt,
          sections: finalSections,
          sectionOrder,
          templateId: raw.templateId,
          industry: raw.industry,
          category: raw.category,
        };
      } else if (docCache[id]) {
        docData = docCache[id];
      } else {
        // Fallback: create blank in-memory only
        docData = {
          id,
          title: "Untitled",
          companyName: "My Company",
          type: "Custom",
          sections: [
            { id: "1", title: "Introduction", content: "", status: "empty" },
          ],
          sectionOrder: ["1"],
        };
      }

      docCache[id] = docData;
      set({
        document: docData,
        activeSectionId: docData.sections[0]?.id || null,
        investorView: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load document:", error);
      toast.error("Failed to load document content.");
      set({ isLoading: false });
    }
  },

  createDocumentFromTemplate: async (templateId, template) => {
    const { user } = useStore.getState();
    if (!user || !user.uid) {
      toast.error("User must be authenticated to create a document.");
      throw new Error("Not authenticated");
    }

    // Fetch user DNA to hydrate template variables
    const dnaStatus = useCompanyDNAStore.getState();
    const dna = dnaStatus.dna;
    const companyName =
      dna?.identity?.name && dna.identity.name.trim().length > 0
        ? dna.identity.name
        : "My Company";

    // Simple hydrated helper
    const hydrate = (text: string) => {
      if (!text) return "";
      let res = text;
      res = res.replace(/\{\{company_name\}\}/g, companyName);
      res = res.replace(
        /\{\{tagline\}\}/g,
        dna?.identity?.tagline || "Your Company Tagline"
      );
      res = res.replace(
        /\{\{problem_statement\}\}/g,
        "problem statement"
      );
      res = res.replace(
        /\{\{industry_name\}\}/g,
        template.industry || "industry"
      );
      res = res.replace(/\{\{date\}\}/g, new Date().toLocaleDateString());
      return res;
    };

    const newId = Date.now().toString();
    const sections: DocumentSection[] = Array.isArray(template.sections)
      ? template.sections.map((s: any, idx: number) => ({
          id: s.id || `s-${idx}`,
          title: hydrate(s.heading || s.title) || "Untitled Section",
          content: hydrate(s.body || s.content) || "",
          status: "empty",
        }))
      : [
          {
            id: "1",
            title: "Introduction",
            content: "",
            status: "empty",
          },
        ];

    const newDoc: DocumentState = {
      id: newId,
      title: `Untitled ${template.name || "Document"}`,
      companyName,
      type: template.category || template.name || "Custom",
      sections,
      sectionOrder: sections.map((s) => s.id),
      templateId: template.id || templateId,
      industry: template.industry || "",
      category: template.category || "",
    };

    try {
      const batch = writeBatch(db);

      // Parent doc: keep sections metadata but ensure primitives are safe
      const docRef = doc(db, "users", user.uid, "documents", newId);
      const parentData: any = {
        id: newDoc.id,
        title: newDoc.title,
        companyName: newDoc.companyName,
        type: newDoc.type,
        originalPrompt: newDoc.originalPrompt || "",
        sections: [], // sections live in subcollection
        sectionOrder: newDoc.sectionOrder || [],
        templateId: newDoc.templateId || null,
        industry: newDoc.industry || "",
        category: newDoc.category || "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      batch.set(docRef, parentData);

      // Write each section to subcollection
      sections.forEach((sec) => {
        const secRef = doc(
          db,
          "users",
          user.uid,
          "documents",
          newId,
          "sections",
          sec.id
        );
        const safeSection: any = {
          id: sec.id,
          title: sec.title || "Untitled Section",
          content: sec.content || "",
          status:
            sec.status === "in-progress" || sec.status === "complete"
              ? sec.status
              : "empty",
        };
        batch.set(secRef, safeSection);
      });

      await batch.commit();
      docCache[newId] = newDoc;
      return newId;
    } catch (error) {
      console.error("[DocumentCreation] Firestore error", {
        code: (error as any)?.code,
        message: (error as any)?.message,
        path: `users/${user.uid}/documents`,
      });
      toast.error("Failed to create document.");
      throw error;
    }
  },

  setActiveSection: (id) => set({ activeSectionId: id }),

  updateSection: (id, content) => {
    const status = content.trim() ? "in-progress" : "empty";
    let currentDocId: string | undefined;

    set((state) => {
      if (!state.document) return state;
      currentDocId = state.document.id;

      const currentState = state.document.sections.map((s) => ({
        sectionId: s.id,
        content: s.content,
      }));

      const newHistory = [...state.history, currentState].slice(-20);

      const newSections: DocumentSection[] = state.document.sections.map((s) =>
        s.id === id ? { ...s, content, status } : s
      );
      const updatedDoc = { ...state.document, sections: newSections };
      docCache[updatedDoc.id] = updatedDoc;
      return { document: updatedDoc, history: newHistory };
    });

    if (!currentDocId) return;

    // Debounce the save to Firestore
    if (saveTimeouts[id]) {
      clearTimeout(saveTimeouts[id]);
    }

    saveTimeouts[id] = setTimeout(() => {
      get().saveSectionToFirestore(currentDocId!, id, content, status);
    }, 1000);
  },

  saveSectionToFirestore: async (docId, id, content, status) => {
    const { user } = useStore.getState();
    if (!user || !user.uid) return;

    try {
      const secRef = doc(db, "users", user.uid, "documents", docId, "sections", id);
      await setDoc(
        secRef,
        {
          content: content || "",
          status:
            status === "in-progress" || status === "complete" ? status : "empty",
        },
        { merge: true }
      );
    } catch (e: any) {
      console.error("[DocumentCreation] Failed to save section:", e);
      toast.error("Failed to save your recent edits.");
    }
  },

  setInvestorView: (view) => set({ investorView: view }),

  reorderSections: (startIndex, endIndex) => {
    set((state) => {
      if (!state.document) return state;
      const result = Array.from(state.document.sections);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      const newOrder = result.map((s) => s.id);
      const updatedDoc = { ...state.document, sections: result, sectionOrder: newOrder };
      docCache[updatedDoc.id] = updatedDoc;

      // Update order in Firestore immediately
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid, "documents", state.document.id);
        setDoc(docRef, { sectionOrder: newOrder }, { merge: true }).catch((err) => {
          console.error("Failed to update section order", err);
          toast.error("Failed to save new order.");
        });
      }

      return { document: updatedDoc };
    });
  },

  addSection: (title) => {
    set((state) => {
      if (!state.document) return state;
      const newSection: DocumentSection = {
        id: Date.now().toString(),
        title: title || "Untitled Section",
        content: "",
        status: "empty",
      };

      const currentState = state.document.sections.map((s) => ({
        sectionId: s.id,
        content: s.content,
      }));
      const newHistory = [...state.history, currentState].slice(-20);

      const newSections = [...state.document.sections, newSection];
      const newOrder = newSections.map((s) => s.id);

      const updatedDoc = {
        ...state.document,
        sections: newSections,
        sectionOrder: newOrder,
      };
      docCache[updatedDoc.id] = updatedDoc;

      // Write to Firestore immediately
      const user = auth.currentUser;
      if (user) {
        const batch = writeBatch(db);
        const docRef = doc(db, "users", user.uid, "documents", state.document.id);
        batch.set(docRef, { sectionOrder: newOrder }, { merge: true });

        const secRef = doc(
          db,
          "users",
          user.uid,
          "documents",
          state.document.id,
          "sections",
          newSection.id
        );
        batch.set(secRef, newSection);

        batch.commit().catch((err) => {
          console.error(err);
          toast.error("Failed to add section.");
        });
      }

      return { document: updatedDoc, history: newHistory };
    });
  },

  undoAction: (docId: string) => {
    set((state) => {
      if (!state.document || state.document.id !== docId || state.history.length === 0)
        return state;

      const previousState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      const newSections = state.document.sections.map((sec) => {
        const prevSec = previousState.find((p) => p.sectionId === sec.id);
        return prevSec ? { ...sec, content: prevSec.content } : sec;
      });

      const updatedDoc = { ...state.document, sections: newSections };
      docCache[updatedDoc.id] = updatedDoc;
      return { document: updatedDoc, history: newHistory };
    });
  },
}));
