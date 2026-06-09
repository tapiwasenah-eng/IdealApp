// src/hooks/useAuthAccess.ts
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAppStore } from '../store/appStore';

export function useAuthAccess() {
  const setUser = useAppStore((state) => state.setUser);
  const setAuthInitialized = useAppStore((state) => state.setAuthInitialized);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
        setAuthInitialized(true);
      } else {
        setUser(null);
        setAuthInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [setUser, setAuthInitialized]);

  return null;
}
