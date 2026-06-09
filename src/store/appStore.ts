import { create } from "zustand";

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface CompanyDna {
  stage: string | null;
  sector: string | null;
}

interface AppState {
  user: User | null;
  companyDna: CompanyDna | null;
  authInitialized: boolean;
  activeWorkspaceId: string | null;
  overlays: { auraVoiceOpen: boolean };
  modals: {
    bringMaterialOpen: boolean;
    onboardingOpen: boolean;
  };
  initialPrompt: string | null;
  onboardingTranscript: string | null;
  setUser: (userOrNull: User | null) => void;
  setCompanyDna: (dna: CompanyDna | null) => void;
  setAuthInitialized: (value: boolean) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  setAuraVoiceOpen: (open: boolean) => void;
  setModalState: (modal: keyof AppState['modals'], open: boolean) => void;
  setInitialPrompt: (prompt: string | null) => void;
  setOnboardingTranscript: (transcript: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  companyDna: null,
  authInitialized: false,
  activeWorkspaceId: null,
  overlays: { auraVoiceOpen: false },
  modals: { bringMaterialOpen: false, onboardingOpen: false },
  initialPrompt: null,
  onboardingTranscript: null,
  setUser: (userOrNull) => set({ user: userOrNull }),
  setCompanyDna: (dna) => set({ companyDna: dna }),
  setAuthInitialized: (value) => set({ authInitialized: value }),
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
  setAuraVoiceOpen: (open) => set((state) => ({ overlays: { ...state.overlays, auraVoiceOpen: open } })),
  setModalState: (modal, open) => set((state) => ({ modals: { ...state.modals, [modal]: open } })),
  setInitialPrompt: (prompt) => set({ initialPrompt: prompt }),
  setOnboardingTranscript: (transcript) => set({ onboardingTranscript: transcript }),
}));

