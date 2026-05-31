import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Tool = 'select' | 'text' | 'rectangle' | 'circle' | 'line' | 'image';

import { DocumentSection } from '../lib/editor/editorTypes';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface EditorState {
  canvas: any | null;
  setCanvas: (canvas: any) => void;
  clearCanvas: () => void;

  sections: DocumentSection[];
  setSections: (sections: DocumentSection[] | ((prev: DocumentSection[]) => DocumentSection[])) => void;
  updateSection: (id: string, updates: Partial<DocumentSection>) => void;

  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;

  rightPanelTab: 'inspector' | 'assistant';
  setRightPanelTab: (tab: 'inspector' | 'assistant') => void;

  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;

  saveStatus: 'saved' | 'saving' | 'error';
  setSaveStatus: (status: 'saved' | 'saving' | 'error') => void;

  selectedObjects: any[];
  setSelectedObjects: (objects: any[]) => void;

  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;

  zoom: number;
  setZoom: (zoom: number) => void;

  isDirty: boolean;
  setDirty: (dirty: boolean) => void;

  undoStack: string[];
  redoStack: string[];
  pushUndo: (state: string) => void;
  undo: () => void;
  redo: () => void;

  aiMessages: AiMessage[];
  addAiMessage: (message: Omit<AiMessage, 'id' | 'timestamp'>) => void;
  clearAiMessages: () => void;
}

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      canvas: null,
      setCanvas: (canvas) => set({ canvas }),
      clearCanvas: () => set({ canvas: null }),
      
      sections: [],
      setSections: (sections) => set((state) => ({ 
        sections: typeof sections === 'function' ? sections(state.sections) : sections 
      })),
      updateSection: (id, updates) => set(s => ({
        sections: s.sections.map(sec => sec.id === id ? { ...sec, ...updates } : sec),
        isDirty: true
      })),

      selectedSectionId: null,
      setSelectedSectionId: (selectedSectionId) => set({ selectedSectionId }),

      rightPanelTab: 'inspector',
      setRightPanelTab: (rightPanelTab) => set({ rightPanelTab }),

      isMobilePreview: true,
      setIsMobilePreview: (isMobilePreview) => set({ isMobilePreview }),

      saveStatus: 'saved',
      setSaveStatus: (saveStatus) => set({ saveStatus }),

      selectedObjects: [],
      setSelectedObjects: (selectedObjects) => set({ selectedObjects }),

      activeTool: 'select',
      setActiveTool: (activeTool) => set({ activeTool }),

      zoom: 1,
      setZoom: (zoom) => set({ zoom }),

      isDirty: false,
      setDirty: (isDirty) => set({ isDirty }),

      undoStack: [],
      redoStack: [],
      pushUndo: (state) => set(s => ({
        undoStack: [...s.undoStack.slice(-49), state],
        redoStack: [],
      })),
      undo: () => set(s => {
        if (s.undoStack.length === 0) return s;
        const stack = [...s.undoStack];
        const last = stack.pop()!;
        return { undoStack: stack, redoStack: [...s.redoStack, last] };
      }),
      redo: () => set(s => {
        if (s.redoStack.length === 0) return s;
        const stack = [...s.redoStack];
        const next = stack.pop()!;
        return { redoStack: stack, undoStack: [...s.undoStack, next] };
      }),

      aiMessages: [],
      addAiMessage: (message) => set(s => ({
        aiMessages: [...s.aiMessages, {
          ...message,
          id: Math.random().toString(36).slice(2),
          timestamp: Date.now(),
        }],
      })),
      clearAiMessages: () => set({ aiMessages: [] }),
    }),
    { name: 'editor-store' }
  )
);
