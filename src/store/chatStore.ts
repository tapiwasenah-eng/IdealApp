import { create } from 'zustand';
import { GeneratedDocument } from '../services/aiService';

export interface ChatOption {
  label: string;
  value: string;
  isOther?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  type: 'text' | 'options' | 'summary' | 'document' | 'input' | 'dualInput' | 'typing';
  options?: ChatOption[];
  document?: GeneratedDocument;
  summary?: ConsultationSummary;
  timestamp: number;
}

export interface ConsultationSummary {
  documentType: string;
  industry: string;
  stage: string;
  keyDetail: string;
  audience: string;
  companyName: string;
  additionalNotes: string;
}

export interface ChatFlowState {
  currentStep: number;
  responses: ConsultationSummary;
  chatMessages: ChatMessage[];
  isGenerating: boolean;
  isTyping: boolean;
  generatedDocument: GeneratedDocument | null;
  setStep: (step: number) => void;
  setResponse: (key: keyof ConsultationSummary, value: string) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsGenerating: (v: boolean) => void;
  setIsTyping: (v: boolean) => void;
  setGeneratedDocument: (doc: GeneratedDocument | null) => void;
  reset: () => void;
}

const defaultResponses: ConsultationSummary = {
  documentType: '',
  industry: '',
  stage: '',
  keyDetail: '',
  audience: '',
  companyName: '',
  additionalNotes: '',
};

export const useChatStore = create<ChatFlowState>((set) => ({
  currentStep: 0,
  responses: { ...defaultResponses },
  chatMessages: [],
  isGenerating: false,
  isTyping: false,
  generatedDocument: null,

  setStep: (step) => set({ currentStep: step }),

  setResponse: (key, value) =>
    set((state) => ({ responses: { ...state.responses, [key]: value } })),

  addMessage: (msg) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { ...msg, id: `msg-${Date.now()}-${Math.random()}`, timestamp: Date.now() },
      ],
    })),

  setIsGenerating: (v) => set({ isGenerating: v }),
  setIsTyping: (v) => set({ isTyping: v }),
  setGeneratedDocument: (doc) => set({ generatedDocument: doc }),

  reset: () =>
    set({
      currentStep: 0,
      responses: { ...defaultResponses },
      chatMessages: [],
      isGenerating: false,
      isTyping: false,
      generatedDocument: null,
    }),
}));
