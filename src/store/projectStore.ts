import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Timestamp } from 'firebase/firestore';
import type { ProjectData } from '../services/projectService';
import { apiFetch } from '../lib/api';

export interface Workspace {
  id: string;
  name: string;
  color?: string;
  createdAt?: Timestamp;
}

type SortOption = 'updated' | 'name' | 'created';

interface ProjectState {
  projects: ProjectData[];
  workspaces: Workspace[];
  searchQuery: string;
  sortBy: SortOption;
  selectedWorkspace: string | null;
  currentView: 'grid' | 'list';

  setProjects: (projects: ProjectData[]) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (sort: SortOption) => void;
  setSelectedWorkspace: (id: string | null) => void;
  setCurrentView: (view: 'grid' | 'list') => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, data: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;

  investors: any[];
  dataRoomLinks: any[];

  loadInvestors: () => Promise<void>;
  addInvestor: (inv: Partial<any>) => Promise<void>;
  importInvestorsFile: (file: File) => Promise<number>;

  loadDataRoomLinks: () => Promise<void>;
  createDataRoomLink: (payload: {
    documentIds: string[];
    hasPassword: boolean;
    password?: string;
    expiresAt?: string | null;
    allowDownload: boolean;
    emailNotify: boolean;
  }) => Promise<{ publicUrl: string }>;

  filteredProjects: ProjectData[];
  recentProjects: ProjectData[];
  trashedProjects: ProjectData[];
  dataRoomProjects: ProjectData[];
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      projects: [],
      workspaces: [],
      searchQuery: '',
      sortBy: 'updated',
      selectedWorkspace: null,
      currentView: 'grid',

      setProjects: (projects) => set({ projects }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSelectedWorkspace: (selectedWorkspace) => set({ selectedWorkspace }),
      setCurrentView: (currentView) => set({ currentView }),
      addWorkspace: (workspace) => set(state => ({ workspaces: [...state.workspaces, workspace] })),
      updateWorkspace: (id, data) => set(state => ({
        workspaces: state.workspaces.map(w => w.id === id ? { ...w, ...data } : w)
      })),
      removeWorkspace: (id) => set(state => ({
        workspaces: state.workspaces.filter(w => w.id !== id)
      })),

      investors: [],
      dataRoomLinks: [],

      loadInvestors: async () => {
        const { db } = await import('../lib/firebase');
        const { collection, getDocs, orderBy, limit, query } = await import('firebase/firestore');
        try {
          const q = query(collection(db, 'investors'), orderBy('createdAt', 'desc'), limit(500));
          const snap = await getDocs(q);
          const invs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          set({ investors: invs });
        } catch (e) {
          console.error("Failed to load investors:", e);
        }
      },

      addInvestor: async (inv) => {
        const { db } = await import('../lib/firebase');
        const { collection, addDoc } = await import('firebase/firestore');
        try {
          await addDoc(collection(db, 'investors'), {
            ...inv,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          await get().loadInvestors();
        } catch (e) {
          console.error("Failed to add investor:", e);
          throw e; // throw error so UI sees it
        }
      },

      importInvestorsFile: async (file) => {
        const user = (await import("../lib/firebase")).auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        if (!token) throw new Error("Not logged in");

        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/investors/import-file", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Import failed");

        await get().loadInvestors();
        return data.imported as number;
      },

      loadDataRoomLinks: async () => {
        const { auth, db } = await import('../lib/firebase');
        const { collection, query, where, orderBy, getDocs, limit } = await import('firebase/firestore');
        if (!auth.currentUser) return;
        try {
          const q = query(
            collection(db, 'dataRoomLinks'),
            where('ownerId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(100)
          );
          const snap = await getDocs(q);
          const links = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          set({ dataRoomLinks: links });
        } catch (e) {
          console.error("Failed to load data room links:", e);
        }
      },

      createDataRoomLink: async (payload) => {
        const { auth, db } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (!auth.currentUser) throw new Error('Not logged in');

        const generateToken = () => {
          const array = new Uint8Array(16);
          crypto.getRandomValues(array);
          return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        };
        const token = generateToken();

        const docData: any = {
          token,
          ownerId: auth.currentUser.uid,
          documentIds: payload.documentIds,
          hasPassword: payload.hasPassword,
          allowDownload: payload.allowDownload,
          emailNotify: payload.emailNotify,
          viewCount: 0,
          accessLog: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (payload.hasPassword && payload.password) {
          docData.passwordHash = btoa(payload.password);
        }
        if (payload.expiresAt) {
          docData.expiresAt = payload.expiresAt;
        }

        await setDoc(doc(db, 'dataRoomLinks', token), docData);

        await get().loadDataRoomLinks();
        return { publicUrl: `${window.location.origin}/data-room/${token}` };
      },

      get filteredProjects() {
        const { projects, searchQuery, sortBy, selectedWorkspace } = get();
        let filtered = projects.filter(p => !p.deletedAt);
        
        if (selectedWorkspace) {
          filtered = filtered.filter(p => p.workspaceId === selectedWorkspace);
        }

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.tags?.some(t => t.toLowerCase().includes(q))
          );
        }
        return [...filtered].sort((a, b) => {
          if (sortBy === 'name') return a.title.localeCompare(b.title);
          if (sortBy === 'created') {
            return (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0);
          }
          return (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0);
        });
      },

      get recentProjects() {
        const { projects } = get();
        return projects
          .filter(p => !p.deletedAt)
          .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0))
          .slice(0, 12);
      },

      get trashedProjects() {
        return get().projects.filter(p => !!p.deletedAt);
      },

      get dataRoomProjects() {
        return get().projects.filter(p => p.isInDataRoom && !p.deletedAt);
      },
    }),
    { name: 'project-store' }
  )
);
