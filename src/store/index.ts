import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from 'firebase/auth';
import type { GeneratedDocument } from '../services/documentGenerator';
import type { Document, Template } from '../types';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  color: string;
  ownerId: string;
  members: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface TemplateFilters {
  search: string;
  category: string;
  industry: string[];
  stage: string[];
  designStyle: string[];
}

// ─── Slice Interfaces ─────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  credits: number;
  subscription: 'free' | 'pro' | 'enterprise';
  usageCount: number;
  createdAt: Date | null;
}

interface AuthSlice {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

interface DocumentSlice {
  documents: Document[];
  activeDocument: Document | null;
  generatedContent: GeneratedDocument | null;
  isGenerating: boolean;
  generationError: string | null;
  preferredModel: 'claude' | 'gemini' | 'auto';
  setDocuments: (documents: Document[]) => void;
  setActiveDocument: (document: Document | null) => void;
  setGeneratedContent: (content: GeneratedDocument | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  setPreferredModel: (model: 'claude' | 'gemini' | 'auto') => void;
}

interface CanvasSlice {
  fabricCanvas: any;
  selectedObject: any;
  history: string[];
  historyIndex: number;
  setFabricCanvas: (canvas: any) => void;
  setSelectedObject: (obj: any) => void;
  pushHistory: (json: string) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

interface TemplateSlice {
  templates: Template[];
  templateFilters: TemplateFilters;
  setTemplates: (templates: Template[]) => void;
  setTemplateFilters: (filters: Partial<TemplateFilters>) => void;
  getFilteredTemplates: () => Template[];
}

interface UISlice {
  sidebarOpen: boolean;
  sidebarTab: 'templates' | 'elements' | 'assets' | 'layers' | 'ai' | 'export';
  showAuthModal: boolean;
  authModalMode: 'login' | 'signup';
  showCreateModal: boolean;
  showTemplatePreview: string | null;
  isExporting: boolean;
  guestCredits: number;
  guestUsageCount: number;
  setSidebarOpen: (open: boolean) => void;
  setSidebarTab: (tab: 'templates' | 'elements' | 'assets' | 'layers' | 'ai' | 'export') => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  setShowCreateModal: (show: boolean) => void;
  setShowTemplatePreview: (templateId: string | null) => void;
  setIsExporting: (isExporting: boolean) => void;
  setGuestCredits: (credits: number) => void;
  decrementGuestCredits: () => void;
  setGuestUsageCount: (count: number) => void;
  incrementGuestUsageCount: () => void;
}

interface WorkspaceSlice {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspaceId: (id: string | null) => void;
}

type StoreState = AuthSlice &
  DocumentSlice &
  CanvasSlice &
  TemplateSlice &
  UISlice &
  WorkspaceSlice &
  TemplateEditorSlice;

interface TemplateEditorSlice {
  templateFieldValues: Record<string, string>;
  activeTemplateId: string | null;
  setTemplateFieldValues: (values: Record<string, string>) => void;
  setActiveTemplateId: (id: string | null) => void;
  updateFieldValue: (fieldName: string, value: string) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // ── Auth ──────────────────────────────────────────────────────────────
        user: null,
        userProfile: null,
        loading: true,
        setUser: (user) => set({ user }, false, 'auth/setUser'),
        setUserProfile: (userProfile) => set({ userProfile }, false, 'auth/setUserProfile'),
        setLoading: (loading) => set({ loading }, false, 'auth/setLoading'),

        // ── Documents ─────────────────────────────────────────────────────────
        documents: [],
        activeDocument: null,
        generatedContent: null,
        isGenerating: false,
        generationError: null,
        preferredModel: 'auto',
        setDocuments: (documents) =>
          set({ documents }, false, 'documents/setDocuments'),
        setActiveDocument: (activeDocument) =>
          set({ activeDocument }, false, 'documents/setActiveDocument'),
        setGeneratedContent: (generatedContent) =>
          set({ generatedContent }, false, 'documents/setGeneratedContent'),
        setIsGenerating: (isGenerating) =>
          set({ isGenerating }, false, 'documents/setIsGenerating'),
        setGenerationError: (generationError) =>
          set({ generationError }, false, 'documents/setGenerationError'),
        setPreferredModel: (preferredModel) =>
          set({ preferredModel }, false, 'documents/setPreferredModel'),

        // ── Canvas ────────────────────────────────────────────────────────────
        fabricCanvas: null,
        selectedObject: null,
        history: [],
        historyIndex: -1,
        setFabricCanvas: (fabricCanvas) =>
          set({ fabricCanvas }, false, 'canvas/setFabricCanvas'),
        setSelectedObject: (selectedObject) =>
          set({ selectedObject }, false, 'canvas/setSelectedObject'),
        pushHistory: (json: string) =>
          set(
            (state) => {
              const sliced = state.history.slice(0, state.historyIndex + 1);
              const newHistory = [...sliced, json];
              return {
                history: newHistory,
                historyIndex: newHistory.length - 1,
              };
            },
            false,
            'canvas/pushHistory'
          ),
        undo: async () => {
          const { history, historyIndex, fabricCanvas } = get();
          if (historyIndex <= 0 || !fabricCanvas) return;
          const newIndex = historyIndex - 1;
          const json = history[newIndex];
          await fabricCanvas.loadFromJSON(JSON.parse(json));
          fabricCanvas.renderAll();
          set({ historyIndex: newIndex }, false, 'canvas/undo');
        },
        redo: async () => {
          const { history, historyIndex, fabricCanvas } = get();
          if (historyIndex >= history.length - 1 || !fabricCanvas) return;
          const newIndex = historyIndex + 1;
          const json = history[newIndex];
          await fabricCanvas.loadFromJSON(JSON.parse(json));
          fabricCanvas.renderAll();
          set({ historyIndex: newIndex }, false, 'canvas/redo');
        },

        // ── Templates ─────────────────────────────────────────────────────────
        templates: [],
        templateFilters: {
          search: '',
          category: '',
          industry: [],
          stage: [],
          designStyle: [],
        },
        setTemplates: (templates) =>
          set({ templates }, false, 'templates/setTemplates'),
        setTemplateFilters: (filters) =>
          set(
            (state) => ({
              templateFilters: { ...state.templateFilters, ...filters },
            }),
            false,
            'templates/setTemplateFilters'
          ),
        getFilteredTemplates: () => {
          const { templates, templateFilters: f } = get();
          return templates.filter((t) => {
            if (
              f.search &&
              !t.title.toLowerCase().includes(f.search.toLowerCase()) &&
              !t.description.toLowerCase().includes(f.search.toLowerCase())
            )
              return false;
            if (f.category && t.category !== f.category) return false;
            if (f.industry.length > 0 && !f.industry.includes(t.industry))
              return false;
            if (f.stage.length > 0 && !f.stage.includes(t.stage)) return false;
            if (f.designStyle.length > 0 && !f.designStyle.includes(t.designStyle))
              return false;
            return true;
          });
        },

        // ── UI ────────────────────────────────────────────────────────────────
        sidebarOpen: true,
        sidebarTab: 'templates',
        showAuthModal: false,
        authModalMode: 'login',
        showCreateModal: false,
        showTemplatePreview: null,
        isExporting: false,
        guestCredits: 3,
        guestUsageCount: 0,
        setSidebarOpen: (sidebarOpen) =>
          set({ sidebarOpen }, false, 'ui/setSidebarOpen'),
        setSidebarTab: (sidebarTab) =>
          set({ sidebarTab }, false, 'ui/setSidebarTab'),
        setShowAuthModal: (showAuthModal) =>
          set({ showAuthModal }, false, 'ui/setShowAuthModal'),
        setAuthModalMode: (authModalMode) =>
          set({ authModalMode }, false, 'ui/setAuthModalMode'),
        setShowCreateModal: (showCreateModal) =>
          set({ showCreateModal }, false, 'ui/setShowCreateModal'),
        setShowTemplatePreview: (showTemplatePreview) =>
          set({ showTemplatePreview }, false, 'ui/setShowTemplatePreview'),
        setIsExporting: (isExporting) =>
          set({ isExporting }, false, 'ui/setIsExporting'),
        setGuestCredits: (guestCredits) =>
          set({ guestCredits }, false, 'ui/setGuestCredits'),
        decrementGuestCredits: () =>
          set(
            (state) => ({ guestCredits: Math.max(0, state.guestCredits - 1) }),
            false,
            'ui/decrementGuestCredits'
          ),
        setGuestUsageCount: (guestUsageCount) =>
          set({ guestUsageCount }, false, 'ui/setGuestUsageCount'),
        incrementGuestUsageCount: () =>
          set(
            (state) => ({ guestUsageCount: state.guestUsageCount + 1 }),
            false,
            'ui/incrementGuestUsageCount'
          ),

        // ── Workspaces ────────────────────────────────────────────────────────
        workspaces: [],
        activeWorkspaceId: null,
        setWorkspaces: (workspaces) =>
          set({ workspaces }, false, 'workspaces/setWorkspaces'),
        setActiveWorkspaceId: (activeWorkspaceId) =>
          set({ activeWorkspaceId }, false, 'workspaces/setActiveWorkspaceId'),

        // ── Template Editor ──────────────────────────────────────────────────
        templateFieldValues: {},
        activeTemplateId: null,
        setTemplateFieldValues: (values) =>
          set({ templateFieldValues: values }, false, 'templateEditor/setTemplateFieldValues'),
        setActiveTemplateId: (id) =>
          set({ activeTemplateId: id }, false, 'templateEditor/setActiveTemplateId'),
        updateFieldValue: (fieldName, value) =>
          set((state) => ({
            templateFieldValues: {
              ...state.templateFieldValues,
              [fieldName]: value,
            },
          }), false, 'templateEditor/updateFieldValue'),
      }),
      {
        name: 'buildit-store',
        partialize: (state) => ({ 
          activeWorkspaceId: state.activeWorkspaceId,
          guestCredits: state.guestCredits,
          guestUsageCount: state.guestUsageCount,
          preferredModel: state.preferredModel,
          templateFieldValues: state.templateFieldValues,
          activeTemplateId: state.activeTemplateId,
        }),
      }
    ),
    { name: 'BuiltIt Store' }
  )
);
