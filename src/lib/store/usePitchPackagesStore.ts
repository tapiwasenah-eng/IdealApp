import { create } from 'zustand';
import { db, auth } from "../firebase";
import { collection, query, getDocs, doc, setDoc, where } from "firebase/firestore";

export interface OutreachRecord {
  id: string;
  investorId: string;
  investorName: string;
  firm: string;
  sentDate: string;
  lastOpened: string;
  timeSpent: string;
  docsViewed: number;
  roomToken?: string;
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
      
      try {
        const viewsSnapshot = await getDocs(query(collection(db, "dataRoomViews"), where("ownerId", "==", user.uid)));
        const viewsByToken: Record<string, { viewCount: number, latestView: any, docs: Set<string> }> = {};
        
        viewsSnapshot.forEach(vDoc => {
          const vData = vDoc.data();
          const token = vData.token;
          if (!token) return;
          if (!viewsByToken[token]) {
            viewsByToken[token] = { viewCount: 0, latestView: null, docs: new Set() };
          }
          viewsByToken[token].viewCount++;
          if (vData.documentId) viewsByToken[token].docs.add(vData.documentId);
          
          if (!viewsByToken[token].latestView || vData.timestamp > viewsByToken[token].latestView) {
            viewsByToken[token].latestView = vData.timestamp;
          }
        });
        
        records.forEach(r => {
          if (r.roomToken && viewsByToken[r.roomToken]) {
            const stats = viewsByToken[r.roomToken];
            r.docsViewed = stats.docs.size;
            if (stats.viewCount > 0 && r.status === "Sent") {
              r.status = "Opened";
            }
            if (stats.latestView) {
              const d = stats.latestView.toDate ? stats.latestView.toDate() : new Date(stats.latestView);
              
              // Formatting helper for relative time
              const now = new Date();
              const diffHrs = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
              
              if (diffHrs < 1) {
                const diffMins = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
                r.lastOpened = diffMins <= 1 ? "Just now" : `${diffMins} mins ago`;
              } else if (diffHrs < 24) {
                r.lastOpened = `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
              } else {
                const diffDays = Math.floor(diffHrs / 24);
                r.lastOpened = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
              }
            }
            r.timeSpent = stats.viewCount > 0 ? `${Math.min(stats.viewCount * 2, 60)} mins` : "--";
          }
        });
      } catch (analyticsErr) {
        console.error("Failed to load analytics, falling back to static record state", analyticsErr);
      }
      
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
