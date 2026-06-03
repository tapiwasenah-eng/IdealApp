import { create } from 'zustand';
import { db, auth } from "../firebase";
import { collection, query, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useStore } from "../../store";

export interface Investor {
  id: string;
  name: string;
  firm: string;
  role: string;
  matchScore: number;
  explanation: string;
  stageTags: string[];
  sectorTags: string[];
  checkSize: string;
  portfolioLogos: string[];
  thesis: string;
  isLocked?: boolean;
}

interface InvestorStore {
  investors: Investor[];
  selectedInvestorId: string | null;
  filters: {
    search: string;
    stage: string[];
    sector: string[];
    checkSizeMin: number;
    checkSizeMax: number;
  };
  isLoading: boolean;
  loadInvestors: () => Promise<void>;
  saveInvestor: (investor: Investor) => Promise<void>;
  deleteInvestor: (id: string) => Promise<void>;
  setSelectedInvestor: (id: string | null) => void;
  setFilters: (filters: Partial<InvestorStore['filters']>) => void;
}

export const useInvestorStore = create<InvestorStore>((set, get) => ({
  investors: [],
  selectedInvestorId: null,
  filters: {
    search: '',
    stage: [],
    sector: [],
    checkSizeMin: 0,
    checkSizeMax: 50000000,
  },
  isLoading: false,

  loadInvestors: async () => {
    set({ isLoading: true });
    try {
      const { user } = useStore.getState();
      if (!user || !user.uid) {
        set({ investors: [], isLoading: false });
        return;
      }
      
      const q = query(collection(db, "users", user.uid, "investors"));
      const querySnapshot = await getDocs(q);
      const investors: Investor[] = [];
      querySnapshot.forEach((doc) => {
        investors.push({ id: doc.id, ...doc.data() } as Investor);
      });
      
      set({ investors, isLoading: false });
    } catch (error) {
      console.error("Failed to load investors:", error);
      set({ isLoading: false });
    }
  },

  saveInvestor: async (investor) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const id = investor.id || Date.now().toString();
      const updatedInvestor = { ...investor, id };

      const docRef = doc(db, "users", user.uid, "investors", id);
      await setDoc(docRef, updatedInvestor);

      const current = get().investors.filter(i => i.id !== id);
      set({ investors: [...current, updatedInvestor] });
    } catch (error) {
      console.error("Failed to save investor:", error);
    }
  },

  deleteInvestor: async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      await deleteDoc(doc(db, "users", user.uid, "investors", id));
      set({ investors: get().investors.filter(i => i.id !== id) });
    } catch (error) {
      console.error("Failed to delete investor:", error);
    }
  },

  setSelectedInvestor: (id) => set({ selectedInvestorId: id }),
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));
