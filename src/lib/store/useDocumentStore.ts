import { create } from "zustand";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch, Timestamp } from "firebase/firestore";
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
  history: Array<{ sectionId: string, content: string }[]>;
  loadAllDocuments: () => Promise<void>;
  loadDocument: (id: string) => Promise<void>;
  createDocumentFromTemplate: (templateId: string, template: any) => Promise<string>;
  setActiveSection: (id: string) => void;
  updateSection: (id: string, content: string) => void;
  saveSectionToFirestore: (docId: string, id: string, content: string, status: string) => Promise<void>;
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
      snap.forEach(d => {
        const data = d.data() as DocumentState;
        docs.push(data);
        docCache[d.id] = data;
      });
      docs.sort((a, b) => b.id.localeCompare(a.id)); // latest first
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
        docData = snap.data() as DocumentState;
        
        // Load sections from subcollection
        const sectionsSnap = await getDocs(collection(db, "users", user.uid, "documents", id, "sections"));
        const subSections: Record<string, DocumentSection> = {};
        sectionsSnap.forEach(s => {
          subSections[s.id] = s.data() as DocumentSection;
        });

        // Resolve sections using sectionOrder, fallback to legacy document.sections
        let finalSections: DocumentSection[] = [];
        if (docData.sectionOrder && docData.sectionOrder.length > 0) {
          docData.sectionOrder.forEach(secId => {
            if (subSections[secId]) finalSections.push(subSections[secId]);
          });
        } else if (docData.sections && docData.sections.length > 0) {
          // Legacy support: sections embedded in document
          finalSections = docData.sections;
        }

        if (finalSections.length === 0) {
           finalSections = [{ id: "1", title: "Introduction", content: "", status: "empty" }];
        }

        docData.sections = finalSections;

      } else if (docCache[id]) {
        docData = docCache[id];
      } else {
        // Fallback or create blank
        docData = {
          id,
          title: "Untitled",
          companyName: "My Company",
          type: "Custom",
          sections: [{ id: "1", title: "Introduction", content: "", status: "empty" }],
          sectionOrder: ["1"]
        };
      }
      
      docCache[id] = docData;
      set({
        document: docData,
        activeSectionId: docData.sections[0]?.id || null,
        investorView: false,
        isLoading: false
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
    const companyName = dna.identity?.name || "My Company";
    
    // Simple hydrated helper
    const hydrate = (text: string) => {
      if (!text) return "";
      let res = text;
      res = res.replace(/\{\{company_name\}\}/g, companyName);
      res = res.replace(/\{\{tagline\}\}/g, dna.identity?.tagline || "Your Company Tagline");
      res = res.replace(/\{\{problem_statement\}\}/g, "problem statement"); // simplistic fill
      res = res.replace(/\{\{industry_name\}\}/g, template.industry || "industry");
      res = res.replace(/\{\{date\}\}/g, new Date().toLocaleDateString());
      return res;
    };

    const newId = Date.now().toString();
    const sections: DocumentSection[] = template.sections ? template.sections.map((s: any, idx: number) => ({
      id: s.id || `s-${idx}`,
      title: hydrate(s.heading) || "Untitled Section",
      content: hydrate(s.body) || "",
      status: "empty"
    })) : [{ id: "1", title: "Introduction", content: "", status: "empty" }];

    const newDoc: DocumentState = {
      id: newId,
      title: `Untitled ${template.name}`,
      companyName: companyName,
      type: template.category || template.name,
      sections: sections,
      sectionOrder: sections.map(s => s.id),
      templateId: template.id,
      industry: template.industry || '',
      category: template.category || ''
    };

    try {
      const batch = writeBatch(db);
      
      // Write parent doc (without heavy sections array to save space)
      const docRef = doc(db, "users", user.uid, "documents", newId);
      const parentData = { ...newDoc, sections: [] }; // Don't duplicate sections locally
      batch.set(docRef, parentData);

      // Write each section to subcollection
      sections.forEach(sec => {
         const secRef = doc(db, "users", user.uid, "documents", newId, "sections", sec.id);
         batch.set(secRef, sec);
      });

      await batch.commit();
      docCache[newId] = newDoc;
      return newId;
    } catch (error) {
      console.error("[DocumentCreation] Firestore error", {
        code: (error as any)?.code,
        message: (error as any)?.message,
        path: `users/${user.uid}/documents`
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
      
      const currentState = state.document.sections.map(s => ({
        sectionId: s.id,
        content: s.content
      }));
      
      const newHistory = [...state.history, currentState].slice(-20); // Keep last 20 states
      
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
      await setDoc(secRef, { content, status }, { merge: true });
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
      
      const newOrder = result.map(s => s.id);
      const updatedDoc = { ...state.document, sections: result, sectionOrder: newOrder };
      docCache[updatedDoc.id] = updatedDoc;

      // Update order in Firestore immediately
      const user = auth.currentUser;
      if (user) {
         const docRef = doc(db, "users", user.uid, "documents", state.document.id);
         setDoc(docRef, { sectionOrder: newOrder }, { merge: true }).catch(err => {
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
        title,
        content: "",
        status: "empty",
      };
      
      const currentState = state.document.sections.map(s => ({
        sectionId: s.id,
        content: s.content
      }));
      const newHistory = [...state.history, currentState].slice(-20);

      const newSections = [...state.document.sections, newSection];
      const newOrder = newSections.map(s => s.id);
      
      const updatedDoc = {
        ...state.document,
        sections: newSections,
        sectionOrder: newOrder
      };
      docCache[updatedDoc.id] = updatedDoc;

      // Write to Firestore immediately
      const user = auth.currentUser;
      if (user) {
         const batch = writeBatch(db);
         const docRef = doc(db, "users", user.uid, "documents", state.document.id);
         batch.set(docRef, { sectionOrder: newOrder }, { merge: true });
         
         const secRef = doc(db, "users", user.uid, "documents", state.document.id, "sections", newSection.id);
         batch.set(secRef, newSection);
         
         batch.commit().catch(err => {
            console.error(err);
            toast.error("Failed to add section.");
         });
      }

      return { document: updatedDoc, history: newHistory };
    });
  },

  undoAction: (docId: string) => {
    set((state) => {
      if (!state.document || state.document.id !== docId || state.history.length === 0) return state;
      
      const previousState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      
      const newSections = state.document.sections.map(sec => {
        const prevSec = previousState.find(p => p.sectionId === sec.id);
        return prevSec ? { ...sec, content: prevSec.content } : sec;
      });
      
      const updatedDoc = { ...state.document, sections: newSections };
      docCache[updatedDoc.id] = updatedDoc;
      return { document: updatedDoc, history: newHistory };
    });
  }
}));

