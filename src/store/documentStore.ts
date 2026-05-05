import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  documentIds: string[];
}

export interface DocumentEntry {
  id: string;
  title: string;
  workspaceId: string | null;
  templateId: string | null;
  status: 'draft' | 'published' | 'archived' | 'in_progress' | 'completed' | 'generating' | 'error';
  type: string;
  collaborators: string[];
  canvasJSON: string | null;
  sections: unknown[] | null;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string | null;
  tags: string[];
}

interface DocumentState {
  documents: DocumentEntry[];
  workspaces: Workspace[];
  currentDocument: DocumentEntry | null;
  addDocument: (doc: DocumentEntry) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<DocumentEntry>) => void;
  duplicateDocument: (id: string) => DocumentEntry | null;
  setCurrentDocument: (doc: DocumentEntry | null) => void;
  getDocumentById: (id: string) => DocumentEntry | undefined;
  addWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  addDocumentToWorkspace: (documentId: string, workspaceId: string) => void;
  removeDocumentFromWorkspace: (documentId: string, workspaceId: string) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      workspaces: [
        {
          id: 'default',
          name: 'My Documents',
          color: '#4f46e5',
          createdAt: new Date().toISOString(),
          documentIds: [],
        },
      ],
      currentDocument: null,

      addDocument: (doc) =>
        set((state) => {
          // Prevent duplicates
          if (state.documents.some((d) => d.id === doc.id)) {
            return state;
          }
          const workspaceId = doc.workspaceId || 'default';
          const updatedWorkspaces = state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? { ...ws, documentIds: [...ws.documentIds, doc.id] }
              : ws
          );
          return {
            documents: [doc, ...state.documents],
            workspaces: updatedWorkspaces,
          };
        }),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
          workspaces: state.workspaces.map((ws) => ({
            ...ws,
            documentIds: ws.documentIds.filter((did) => did !== id),
          })),
          currentDocument:
            state.currentDocument?.id === id ? null : state.currentDocument,
        })),

      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id
              ? { ...d, ...updates, updatedAt: new Date().toISOString() }
              : d
          ),
          currentDocument:
            state.currentDocument?.id === id
              ? {
                  ...state.currentDocument,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.currentDocument,
        })),

      duplicateDocument: (id) => {
        const state = get();
        const original = state.documents.find((d) => d.id === id);
        if (!original) return null;
        const duplicate: DocumentEntry = {
          ...original,
          id: crypto.randomUUID(),
          title: `${original.title} (Copy)`,
          status: 'draft',
          type: original.type || 'General',
          collaborators: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ documents: [duplicate, ...s.documents] }));
        return duplicate;
      },

      setCurrentDocument: (doc) => set({ currentDocument: doc }),

      getDocumentById: (id) => get().documents.find((d) => d.id === id),

      addWorkspace: (workspace) =>
        set((state) => ({ workspaces: [...state.workspaces, workspace] })),

      deleteWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((ws) => ws.id !== id),
          documents: state.documents.map((d) =>
            d.workspaceId === id ? { ...d, workspaceId: 'default' } : d
          ),
        })),

      renameWorkspace: (id, name) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id ? { ...ws, name } : ws
          ),
        })),

      addDocumentToWorkspace: (documentId, workspaceId) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId && !ws.documentIds.includes(documentId)
              ? { ...ws, documentIds: [...ws.documentIds, documentId] }
              : ws
          ),
          documents: state.documents.map((d) =>
            d.id === documentId ? { ...d, workspaceId } : d
          ),
        })),

      removeDocumentFromWorkspace: (documentId, workspaceId) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  documentIds: ws.documentIds.filter((id) => id !== documentId),
                }
              : ws
          ),
        })),
    }),
    {
      name: 'builtit-documents',
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Clean up duplicate documents on load
          const seen = new Set();
          state.documents = state.documents.filter((doc) => {
            if (seen.has(doc.id)) return false;
            seen.add(doc.id);
            return true;
          });
        }
      },
    }
  )
);
