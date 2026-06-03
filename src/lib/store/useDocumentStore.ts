import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';

export interface Section {
  id: string;
  title: string;
  content: string;
  status?: string;
}

export interface DocumentMeta {
  id: string;
  title: string;
  companyName?: string;
  industry?: string;
  stage?: string;
  type?: string;
  documentType?: string; // Pitch Deck, Info Memo, etc.
  lastEditedTimestamp: number; // epoch ms
  sections: Section[];
  originalPrompt?: string;
}

interface HistoryFrame {
  sectionId: string;
  content: string;
}

interface DocumentStoreState {
  document: DocumentMeta | null;
  currentDocument: DocumentMeta | null;
  documents: DocumentMeta[];
  loading: boolean;
  error: string | null;
  history: HistoryFrame[][]; // stack of frames; last = latest
  maxHistory: number;
  activeSectionId: string | null;
  investorView: boolean;

  // Actions
  setDocument: (doc: DocumentMeta | null) => void;
  loadDocumentById: (docId: string) => Promise<void>;
  loadDocumentsForCurrentUser: () => Promise<void>;
  loadAllDocuments: () => Promise<void>;
  updateSectionContent: (sectionId: string, newContent: string) => void;
  pushHistorySnapshot: () => void;
  undoAction: (docId: string) => void;
  setLoading: (value: boolean) => void;
  setError: (msg: string | null) => void;
  saveCurrentDocument: () => Promise<void>;
  deleteDocument: (docId: string) => Promise<void>;
  setActiveSection: (id: string | null) => void;
  setInvestorView: (val: boolean) => void;
  createDocumentFromTemplate: (templateId: string, templateData: any) => Promise<string | void>;
  addSection?: (title?: string) => void;
}

const docCache: Record<string, DocumentMeta> = {};

export const useDocumentStore = create<DocumentStoreState>()(
  persist(
    (set, get) => ({
      document: null,
      currentDocument: null,
      documents: [],
      loading: false,
      error: null,
      history: [],
      maxHistory: 20,
      activeSectionId: null,
      investorView: false,

      setActiveSection: (id) => set({ activeSectionId: id }),
      setInvestorView: (val) => set({ investorView: val }),

      createDocumentFromTemplate: async (templateId, templateData) => {
        // basic stub to prevent crashes elsewhere
        console.warn('createDocumentFromTemplate mock', templateId);
      },

      setDocument: (doc) => {
        if (doc) {
          docCache[doc.id] = doc;
        }
        set({ document: doc, currentDocument: doc });
      },

      setLoading: (value) => set({ loading: value }),

      setError: (msg) => set({ error: msg }),

      loadDocumentById: async (docId: string) => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          setError(null);

          if (!auth.currentUser) {
            throw new Error('User not authenticated');
          }
          const uid = auth.currentUser.uid;
          const docRef = doc(db, 'users', uid, 'documents', docId);
          const snap = await getDoc(docRef);

          if (!snap.exists()) {
            throw new Error('Document not found');
          }

          const data = snap.data() as any;
          const loaded: DocumentMeta = {
            id: docId,
            title: data.title || 'Untitled Document',
            companyName: data.companyName,
            industry: data.industry,
            stage: data.stage,
            documentType: data.documentType || 'Pitch Deck',
            lastEditedTimestamp: data.lastEditedTimestamp || Date.now(),
            sections: (data.sections || []) as Section[],
            originalPrompt: data.originalPrompt,
          };

          docCache[docId] = loaded;
          set({ document: loaded, currentDocument: loaded, history: [] });
        } catch (err: any) {
          console.error('Error loading document:', err);
          setError(err.message || 'Failed to load document');
        } finally {
          setLoading(false);
        }
      },

      loadDocumentsForCurrentUser: async () => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          setError(null);

          if (!auth.currentUser) {
            throw new Error('User not authenticated');
          }
          const uid = auth.currentUser.uid;
          const docsRef = collection(db, 'users', uid, 'documents');
          const q = query(docsRef, orderBy('lastEditedTimestamp', 'desc'));
          const snapshot = await getDocs(q);

          const list: DocumentMeta[] = [];
          snapshot.forEach((snap) => {
            const data = snap.data() as any;
            list.push({
              id: snap.id,
              title: data.title || 'Untitled Document',
              companyName: data.companyName,
              industry: data.industry,
              stage: data.stage,
              documentType: data.documentType || 'Pitch Deck',
              lastEditedTimestamp: data.lastEditedTimestamp || Date.now(),
              sections: (data.sections || []) as Section[],
              originalPrompt: data.originalPrompt,
            });
          });

          set({ documents: list });
        } catch (err: any) {
          console.error('Error loading documents list:', err);
          setError(err.message || 'Failed to load documents');
        } finally {
          setLoading(false);
        }
      },

      loadAllDocuments: async () => {
        return get().loadDocumentsForCurrentUser();
      },

      pushHistorySnapshot: () => {
        const state = get();
        const currentDoc = state.document;
        if (!currentDoc) return;

        const frame: HistoryFrame[] = currentDoc.sections.map((s) => ({
          sectionId: s.id,
          content: s.content,
        }));

        const newHistory = [...state.history, frame];
        if (newHistory.length > state.maxHistory) {
          newHistory.shift();
        }
        set({ history: newHistory });
      },

      updateSectionContent: (sectionId, newContent) => {
        const state = get();
        const currentDoc = state.document;
        if (!currentDoc) return;

        const existingSection = currentDoc.sections.find((s) => s.id === sectionId);
        if (!existingSection) return;

        // If content has not changed, do not push history
        if (existingSection.content === newContent) return;

        // Push snapshot before mutation
        state.pushHistorySnapshot();

        const newSections = currentDoc.sections.map((sec) =>
          sec.id === sectionId ? { ...sec, content: newContent } : sec,
        );

        const updatedDoc: DocumentMeta = {
          ...currentDoc,
          sections: newSections,
          lastEditedTimestamp: Date.now(),
        };

        docCache[updatedDoc.id] = updatedDoc;
        set({ document: updatedDoc, currentDocument: updatedDoc });
      },

      undoAction: (docId: string) => {
        set((state) => {
          if (!state.document || state.document.id !== docId || state.history.length === 0) {
            return state;
          }

          const previousState = state.history[state.history.length - 1];
          const newHistory = state.history.slice(0, -1);

          const newSections = state.document.sections.map((sec) => {
            const prevSec = previousState.find((p) => p.sectionId === sec.id);
            return prevSec ? { ...sec, content: prevSec.content } : sec;
          });

          const updatedDoc: DocumentMeta = {
            ...state.document,
            sections: newSections,
            lastEditedTimestamp: Date.now(),
          };

          docCache[updatedDoc.id] = updatedDoc;
          return { document: updatedDoc, currentDocument: updatedDoc, history: newHistory };
        });
      },

      saveCurrentDocument: async () => {
        const { document, setLoading, setError } = get();
        if (!document) return;
        try {
          setLoading(true);
          const uid = auth.currentUser?.uid;
          if (!uid) throw new Error('Not auth');
          const docRef = doc(db, 'users', uid, 'documents', document.id);
          await setDoc(docRef, document, { merge: true });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },

      deleteDocument: async (docId: string) => {
        const { setLoading, setError, loadDocumentsForCurrentUser } = get();
        try {
          setLoading(true);
          const uid = auth.currentUser?.uid;
          if (!uid) throw new Error('Not auth');
          await deleteDoc(doc(db, 'users', uid, 'documents', docId));
          delete docCache[docId];
          await loadDocumentsForCurrentUser();
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'document-storage',
      partialize: (state) => ({ documents: state.documents })
    }
  )
);
