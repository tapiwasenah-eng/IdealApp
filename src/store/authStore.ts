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
import { useBillingStore } from '../lib/store/useBillingStore';
import { useStore } from './index';
import { track } from '../lib/analytics';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'studio';
  aiRequestsToday: number;
  lastAiRequestDate: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateSubscription: (plan: 'free' | 'pro' | 'studio') => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      track("user_logged_in", { user_id: user.uid, method: "email" });
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
        plan: 'free',
        aiRequestsToday: 0,
        lastAiRequestDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), profile);
      useBillingStore.getState().setPlan(profile.plan);
      set({ profile, user, isAuthenticated: true });
      track("user_signed_up", { user_id: user.uid, method: "email", source: "auth_modal" });
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
      
      let profile;
      if (!docSnap.exists()) {
        profile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || undefined,
          role: 'user',
          plan: 'free',
          aiRequestsToday: 0,
          lastAiRequestDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        };
        await setDoc(docRef, profile);
        track("user_signed_up", { user_id: user.uid, method: "google", source: "auth_modal" });
      } else {
        profile = docSnap.data() as UserProfile;
        track("user_logged_in", { user_id: user.uid, method: "google" });
      }
      useBillingStore.getState().setPlan(profile.plan);
      set({ profile, user, isAuthenticated: true });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    useBillingStore.getState().setPlan('free');
    set({ user: null, profile: null, isAuthenticated: false });
  },

  updateSubscription: async (plan) => {
    const { profile } = get();
    if (!profile) return;

    try {
      const oldPlan = profile.plan;
      const updatedProfile = { ...profile, plan };
      await setDoc(doc(db, 'users', profile.uid), updatedProfile, { merge: true });
      useBillingStore.getState().setPlan(plan);
      set({ profile: updatedProfile });
      
      if (oldPlan !== plan) {
        if (plan === 'pro' || plan === 'studio') {
          track("user_upgraded_plan", { user_id: profile.uid, plan_type: plan, previous_plan: oldPlan });
        } else {
          track("user_downgraded_plan", { user_id: profile.uid, plan_type: plan, previous_plan: oldPlan });
        }
      }
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  setLoading: (loading) => set({ loading }),
}));

// Initialize auth listener
onAuthStateChanged(auth, async (user) => {
  useAuthStore.setState({ loading: true });
  useStore.getState().setLoading(true);

  if (user) {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const profile = docSnap.data() as UserProfile;
      useAuthStore.setState({ user, profile, isAuthenticated: true });
      useBillingStore.getState().setPlan(profile.plan);
      
      // Sync legacy store
      useStore.getState().setUser(user);
      useStore.getState().setUserProfile({ ...profile, subscription: profile.plan as any } as any);
    } else {
      useAuthStore.setState({ user, profile: null, isAuthenticated: true });
      useStore.getState().setUser(user);
      useStore.getState().setUserProfile(null);
    }
  } else {
    useAuthStore.setState({ user: null, profile: null, isAuthenticated: false });
    useBillingStore.getState().setPlan('free');
    useStore.getState().setUser(null);
    useStore.getState().setUserProfile(null);
  }
  useAuthStore.setState({ loading: false });
  useStore.getState().setLoading(false);
});
