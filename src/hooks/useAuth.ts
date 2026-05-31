import { useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '../lib/firebase';
import { useStore } from '../store';

export function useAuth() {
  const { user, loading, setUser, setLoading } = useStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sign in failed';
      toast.error(message);
      throw err;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      setUser({ ...credential.user, displayName });
      toast.success(`Welcome, ${displayName}!`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sign up failed';
      toast.error(message);
      throw err;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google sign-in failed';
      toast.error(message);
      throw err;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      toast.success('Signed out');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sign out failed';
      toast.error(message);
      throw err;
    }
  };

  return { user, loading, signIn, signUp, signInWithGoogle, signOut };
}
