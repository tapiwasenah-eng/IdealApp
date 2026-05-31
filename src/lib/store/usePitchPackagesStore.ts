import { create } from 'zustand';
import { db, auth } from "../firebase";
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";

export interface OutreachRecord {
  id: string;
  investorId: string;
  investorName: string;
  firm: string;
  sentDate: string;
  lastOpened: string;
  timeSpent: string;
  docsViewed: number;
  status: 'Sent' | 'Opened' | 'Active' | 'Interested' | 'Responded' | 'Meeting';
}

interface PitchPackagesStore {
  records: OutreachRecord[];
  isLoading: boolean;
  loadRecords: () => Promise<void>;
  updateRecord: (record: OutreachRecord) => Promise<void>;
}

export const usePitchPackagesStore = create<PitchPackagesStore>((set, get) => ({
  records: [],
  isLoading: false,

  loadRecords: async () => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) {
        set({ records: [], isLoading: false });
        return;
      }
      
      const q = query(collection(db, "users", user.uid, "outreach"));
      const querySnapshot = await getDocs(q);
      const records: OutreachRecord[] = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as OutreachRecord);
      });
      
      set({ records, isLoading: false });
    } catch (error) {
      console.error("Failed to load outreach records:", error);
      set({ isLoading: false });
    }
  },

  updateRecord: async (record) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const id = record.id || Date.now().toString();
      const updatedRecord = { ...record, id };

      const docRef = doc(db, "users", user.uid, "outreach", id);
      await setDoc(docRef, updatedRecord, { merge: true });

      const current = get().records.filter(r => r.id !== id);
      set({ records: [...current, updatedRecord] });
    } catch (error) {
      console.error("Failed to update outreach record:", error);
    }
  }
}));
