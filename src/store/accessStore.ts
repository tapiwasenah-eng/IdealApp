// src/store/accessStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubscriptionTier, TIER_LIMITS } from '../types/access';

interface AccessState {
  tier: SubscriptionTier;
  usageCount: number;
  guestUsageCount: number;
  setTier: (tier: SubscriptionTier) => void;
  incrementUsage: () => void;
  incrementGuestUsage: () => void;
  resetUsage: () => void;
  canPerformAction: (action: 'ai' | 'export' | 'template') => boolean;
}

export const useAccessStore = create<AccessState>()(
  persist(
    (set, get) => ({
      tier: 'guest',
      usageCount: 0,
      guestUsageCount: 0,
      setTier: (tier) => set({ tier }),
      incrementUsage: () => set((state) => ({ usageCount: state.usageCount + 1 })),
      incrementGuestUsage: () => set((state) => ({ guestUsageCount: state.guestUsageCount + 1 })),
      resetUsage: () => set({ usageCount: 0, guestUsageCount: 0 }),
      canPerformAction: (action) => {
        const { tier, usageCount, guestUsageCount } = get();
        const limits = TIER_LIMITS[tier];
        
        if (tier === 'guest') {
          if (guestUsageCount >= (limits.maxUsage || 3)) return false;
        } else if (tier === 'free') {
          if (usageCount >= (limits.maxUsage || 10)) return false;
        }
        
        if (action === 'export' && !limits.canExportPDF) return false;
        
        return true;
      },
    }),
    {
      name: 'built-it-access',
    }
  )
);
