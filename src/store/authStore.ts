import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'pro' | 'enterprise';
  usageCount: number;
  createdAt: any;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateSubscription: (subscription: 'free' | 'pro' | 'enterprise') => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role: 'user',
        subscription: 'free',
        usageCount: 0,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), profile);
      set({ profile });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if profile exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || undefined,
          role: 'user',
          subscription: 'free',
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        await setDoc(docRef, profile);
        set({ profile });
      } else {
        set({ profile: docSnap.data() as UserProfile });
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null, profile: null });
  },

  updateSubscription: async (subscription) => {
    const { profile } = get();
    if (!profile) return;

    try {
      const updatedProfile = { ...profile, subscription };
      await setDoc(doc(db, 'users', profile.uid), updatedProfile);
      set({ profile: updatedProfile });
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  setLoading: (loading) => set({ loading }),
}));

// Initialize auth listener
onAuthStateChanged(auth, async (user) => {
  useAuthStore.setState({ user, loading: true });
  if (user) {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      useAuthStore.setState({ profile: docSnap.data() as UserProfile });
    }
  } else {
    useAuthStore.setState({ profile: null });
  }
  useAuthStore.setState({ loading: false });
});
