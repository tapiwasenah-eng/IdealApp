import { create } from "zustand";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";

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
  sections: DocumentSection[];
}

interface DocumentStore {
  documents: DocumentState[];
  document: DocumentState | null;
  activeSectionId: string | null;
  investorView: boolean;
  isLoading: boolean;
  loadAllDocuments: () => Promise<void>;
  loadDocument: (id: string) => Promise<void>;
  createDocumentFromTemplate: (templateId: string, template: any) => Promise<string>;
  setActiveSection: (id: string) => void;
  updateSection: (id: string, content: string) => void;
  setInvestorView: (view: boolean) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  addSection: (title: string) => void;
  saveCurrentDocument: () => Promise<void>;
}

// In-memory cache for fast switching during session
const docCache: Record<string, DocumentState> = {};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  document: null,
  activeSectionId: null,
  investorView: false,
  isLoading: false,

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
      } else if (docCache[id]) {
        docData = docCache[id];
      } else {
        // Fallback or create blank
        docData = {
          id,
          title: "Untitled",
          companyName: "My Company",
          type: "Custom",
          sections: [{ id: "1", title: "Introduction", content: "", status: "empty" }]
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
      set({ isLoading: false });
    }
  },

  createDocumentFromTemplate: async (templateId, template) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const newId = Date.now().toString();
    const newDoc: DocumentState = {
      id: newId,
      title: `Untitled ${template.name}`,
      companyName: "My Company",
      type: template.category || template.name,
      sections: template.sections ? template.sections.map((s: any, idx: number) => ({
        id: s.id || `s-${idx}`,
        title: s.heading || "Untitled Section",
        content: s.body || "",
        status: "empty"
      })) : [{ id: "1", title: "Introduction", content: "", status: "empty" }]
    };

    const docRef = doc(db, "users", user.uid, "documents", newId);
    await setDoc(docRef, newDoc);
    docCache[newId] = newDoc;
    return newId;
  },

  setActiveSection: (id) => set({ activeSectionId: id }),

  updateSection: (id, content) => {
    set((state) => {
      if (!state.document) return state;
      const newSections: DocumentSection[] = state.document.sections.map((s) =>
        s.id === id
          ? {
              ...s,
              content,
              status: (content.trim() ? "in-progress" : "empty") as "in-progress" | "empty",
            }
          : s
      );
      const updatedDoc = { ...state.document, sections: newSections };
      docCache[updatedDoc.id] = updatedDoc;
      return { document: updatedDoc };
    });
    get().saveCurrentDocument(); // Debounced save handled by components or here, calling save
  },

  saveCurrentDocument: async () => {
    const { document } = get();
    if (!document) return;
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const docRef = doc(db, "users", user.uid, "documents", document.id);
      await setDoc(docRef, document, { merge: true });
    } catch (e) {
      console.error("Failed to save document:", e);
    }
  },

  setInvestorView: (view) => set({ investorView: view }),

  reorderSections: (startIndex, endIndex) => {
    set((state) => {
      if (!state.document) return state;
      const result = Array.from(state.document.sections);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const updatedDoc = { ...state.document, sections: result };
      docCache[updatedDoc.id] = updatedDoc;
      return { document: updatedDoc };
    });
    get().saveCurrentDocument();
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
      const updatedDoc = {
        ...state.document,
        sections: [...state.document.sections, newSection],
      };
      docCache[updatedDoc.id] = updatedDoc;
      return { document: updatedDoc };
    });
    get().saveCurrentDocument();
  },
}));
