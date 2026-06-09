import { create } from 'zustand';
import { WorkspaceDoc } from '../lib/firestoreTypes';

export interface WorkspaceSection {
  id: string;
  label: string;
  order: number;
  completeness?: number;
}

export interface WorkspaceState {
  activeWorkspace: WorkspaceDoc | null;
  sections: WorkspaceSection[];
  activeSectionId: string | null;
  setActiveWorkspace: (ws: WorkspaceDoc) => void;
  setSections: (sections: WorkspaceSection[]) => void;
  setActiveSection: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: null,
  sections: [],
  activeSectionId: null,
  setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),
  setSections: (sections) => set({ sections }),
  setActiveSection: (id) => set({ activeSectionId: id }),
}));
