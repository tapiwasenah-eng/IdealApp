import { create } from 'zustand';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { debounce } from '../debounce';

export interface CompanyDNA {
  identity: {
    name: string;
    website: string;
    tagline: string;
    foundingYear: string;
    hq: string;
  };
  whatYouDo: {
    oneLinePitch: string;
    description: string;
  };
  traction: {
    mrr: string;
    users: string;
    growthRate: string;
    milestones: string;
  };
  fundraising: {
    stage: string;
    amountRaising: string;
    useOfFunds: string;
    previousRounds: string;
  };
  team: {
    founders: string;
    bios: string;
  };
  market: {
    tam: string;
    targetCustomer: string;
    geography: string;
  };
  competition: {
    competitors: string;
    differentiators: string;
  };
  branding: {
    brandColors: string;
    preferredFont: string;
  };
}

const defaultDNA: CompanyDNA = {
  identity: { name: '', website: '', tagline: '', foundingYear: '', hq: '' },
  whatYouDo: { oneLinePitch: '', description: '' },
  traction: { mrr: '', users: '', growthRate: '', milestones: '' },
  fundraising: { stage: '', amountRaising: '', useOfFunds: '', previousRounds: '' },
  team: { founders: '', bios: '' },
  market: { tam: '', targetCustomer: '', geography: '' },
  competition: { competitors: '', differentiators: '' },
  branding: { brandColors: '#3D35C8', preferredFont: 'Geist' },
};

interface CompanyDNAStore {
  dna: CompanyDNA;
  isLoading: boolean;
  loadDNA: () => Promise<void>;
  updateDNA: (section: keyof CompanyDNA, data: Partial<any>) => void;
  getStrengthPercentage: () => number;
}

const saveDNAToFirestore = debounce(async (dna: CompanyDNA) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(doc(db, "users", user.uid, "dna", "current"), dna, { merge: true });
  } catch (err) {
    console.error("Failed to save DNA", err);
  }
}, 1000);

export const useCompanyDNAStore = create<CompanyDNAStore>((set, get) => ({
  dna: defaultDNA,
  isLoading: false,
  loadDNA: async () => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) {
        set({ dna: defaultDNA, isLoading: false });
        return;
      }
      const docRef = doc(db, "users", user.uid, "dna", "current");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        set({ dna: { ...defaultDNA, ...snap.data() as CompanyDNA }, isLoading: false });
      } else {
        set({ dna: defaultDNA, isLoading: false });
      }
    } catch (e) {
      console.error("Failed to load DNA", e);
      set({ isLoading: false });
    }
  },
  updateDNA: (section, data) => set((state) => {
    const newDNA = {
      ...state.dna,
      [section]: { ...state.dna[section], ...data }
    };
    saveDNAToFirestore(newDNA);
    return { dna: newDNA };
  }),
  getStrengthPercentage: () => {
    let filled = 0;
    let total = 0;
    const { dna } = get();
    Object.values(dna).forEach(section => {
      Object.values(section).forEach((val: any) => {
        total++;
        if (typeof val === 'string' && val.trim().length > 0) filled++;
      });
    });
    return total === 0 ? 0 : Math.round((filled / total) * 100);
  }
}));
