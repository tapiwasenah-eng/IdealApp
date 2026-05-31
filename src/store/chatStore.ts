import { create } from 'zustand';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationInfo {
  id: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
  previewMatch?: string; // a short preview
  title?: string;
  messages?: Message[];
}

interface ChatStore {
  conversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  history: ConversationInfo[];
  
  // Actions
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  createConversation: (userId: string, type?: string) => Promise<string>;
  loadConversation: (conversationId: string) => Promise<void>;
  fetchHistory: (userId: string) => Promise<void>;
  syncConversation: () => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversationId: null,
  messages: [],
  isLoading: false,
  history: [],

  addMessage: async (message) => {
    // Add to local state
    set((state) => ({ messages: [...state.messages, message] }));

    const { conversationId, messages } = get();
    if (conversationId) {
      try {
        const userMessage = messages.find(m => m.role === 'user');
        const titleText = userMessage ? userMessage.content.substring(0, 40) + (userMessage.content.length > 40 ? '...' : '') : 'New Chat';
        await updateDoc(doc(db, 'conversations', conversationId), {
          messages: get().messages,
          title: titleText,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error("Failed to sync message to firestore", e);
      }
    }
  },

  updateLastMessage: async (content) => {
    let syncNeeded = false;
    set((state) => {
      const msgs = [...state.messages];
      if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...msgs[msgs.length - 1],
          content,
        };
        syncNeeded = true;
      }
      return { messages: msgs };
    });

    const { conversationId } = get();
    // Only debounce or update rarely to avoid excessive writes, but for simplicity we write on finish or debounce it.
    // Wait, updating on every chunk is too expensive for Firestore!
    // We should only sync when done. The component can call a `saveConversation` action instead.
  },

  setLoading: (loading) => set({ isLoading: loading }),

  createConversation: async (userId, type = 'general') => {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await setDoc(doc(db, 'conversations', conversationId), {
      userId,
      type,
      messages: [],
      title: 'New Chat',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    set({ conversationId, messages: [] });
    // Reload history
    get().fetchHistory(userId);
    return conversationId;
  },

  loadConversation: async (conversationId) => {
    const docRef = doc(db, 'conversations', conversationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const loadedMessages = (data.messages || []).map((m: any) => ({
        ...m,
        timestamp: m.timestamp?.toDate ? m.timestamp.toDate() : new Date(m.timestamp),
      }));
      set({ conversationId, messages: loadedMessages });
    }
  },

  fetchHistory: async (userId) => {
    try {
      const colRef = collection(db, 'conversations');
      const q = query(colRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      const history = snap.docs.map(d => ({ id: d.id, ...d.data() } as ConversationInfo));
      set({ history });
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  },

  syncConversation: async () => {
    const { conversationId, messages } = get();
    if (conversationId) {
      try {
        const userMessage = messages.find(m => m.role === 'user');
        const titleText = userMessage ? userMessage.content.substring(0, 40) + (userMessage.content.length > 40 ? '...' : '') : 'New Chat';
        await updateDoc(doc(db, 'conversations', conversationId), {
          messages: messages,
          title: titleText,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error("Failed to sync message to firestore", e);
      }
    }
  },

  clearMessages: () => set({ messages: [], conversationId: null }),
}));

