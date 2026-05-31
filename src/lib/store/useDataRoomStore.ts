import { create } from "zustand";
import { db, auth } from "../firebase";
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";

export interface DataRoomDocument {
  id: string;
  name: string;
  type:
    | "Pitch Deck"
    | "Financial Model"
    | "Investment Memo"
    | "Legal"
    | "Other";
  folderId: string;
  status: "Draft" | "In Review" | "Investor-Ready";
  views: number;
  lastViewed?: string;
  updatedAt: string;
}

export interface DataRoomFolder {
  id: string;
  name: string;
  iconName: string;
}

const defaultFolders: DataRoomFolder[] = [
  { id: "f-1", name: "Pitch Materials", iconName: "MonitorPlay" },
  { id: "f-2", name: "Financials", iconName: "LineChart" },
  { id: "f-3", name: "Legal", iconName: "Scale" },
  { id: "f-4", name: "Product", iconName: "Box" },
  { id: "f-5", name: "Traction", iconName: "TrendingUp" },
  { id: "f-6", name: "Team", iconName: "Users" },
];

interface DataRoomStore {
  folders: DataRoomFolder[];
  documents: DataRoomDocument[];
  selectedFolderId: string | null;
  isLoading: boolean;
  loadDataRoom: () => Promise<void>;
  updateDocument: (docData: DataRoomDocument) => Promise<void>;
  setSelectedFolder: (id: string | null) => void;
}

export const useDataRoomStore = create<DataRoomStore>((set, get) => ({
  folders: defaultFolders, // We'll keep default folders unless they need to be configurable
  documents: [],
  selectedFolderId: "f-1",
  isLoading: false,

  loadDataRoom: async () => {
    set({ isLoading: true });
    try {
      const user = auth.currentUser;
      if (!user) {
        set({ documents: [], isLoading: false });
        return;
      }
      
      const q = query(collection(db, "users", user.uid, "dataRoomDocs"));
      const querySnapshot = await getDocs(q);
      const docs: DataRoomDocument[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as DataRoomDocument);
      });
      
      set({ documents: docs, isLoading: false });
    } catch (error) {
      console.error("Failed to load data room docs:", error);
      set({ isLoading: false });
    }
  },

  updateDocument: async (docData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const id = docData.id || Date.now().toString();
      const updatedDoc = { ...docData, id };

      const docRef = doc(db, "users", user.uid, "dataRoomDocs", id);
      await setDoc(docRef, updatedDoc, { merge: true });

      const current = get().documents.filter(d => d.id !== id);
      set({ documents: [...current, updatedDoc] });
    } catch (error) {
      console.error("Failed to update data room doc:", error);
    }
  },

  setSelectedFolder: (id) => set({ selectedFolderId: id }),
}));
