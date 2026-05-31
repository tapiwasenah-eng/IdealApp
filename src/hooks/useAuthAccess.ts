// src/hooks/useAuthAccess.ts
import { useEffect } from 'react';
import { useStore } from '../store';
import { useAccessStore } from '../store/accessStore';
import { SubscriptionTier } from '../types/access';

export function useAuthAccess() {
  const { user, userProfile } = useStore();
  const { setTier } = useAccessStore();

  useEffect(() => {
    if (user) {
      const tier = (userProfile?.subscription || 'free') as SubscriptionTier;
      setTier(tier);
    } else {
      setTier('guest');
    }
  }, [user, userProfile, setTier]);

  return null;
}
