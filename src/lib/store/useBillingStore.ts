import { create } from 'zustand';

export type PlanType = 'free' | 'pro' | 'studio';

export type FeatureKey = 
  | 'investor_match_pro' 
  | 'automated_outreach' 
  | 'data_room_analytics' 
  | 'data_room_security'
  | 'custom_domain';

interface BillingStore {
  currentPlan: PlanType;
  isUpgradeModalOpen: boolean;
  upgradeModalFeature: FeatureKey | null;
  setPlan: (plan: PlanType) => void;
  openUpgradeModal: (feature?: FeatureKey) => void;
  closeUpgradeModal: () => void;
  canUseFeature: (feature: FeatureKey) => boolean;
}

export const useBillingStore = create<BillingStore>((set, get) => ({
  currentPlan: 'free',
  isUpgradeModalOpen: false,
  upgradeModalFeature: null,
  setPlan: (plan) => set({ currentPlan: plan }),
  openUpgradeModal: (feature = null) => set({ isUpgradeModalOpen: true, upgradeModalFeature: feature }),
  closeUpgradeModal: () => set({ isUpgradeModalOpen: false, upgradeModalFeature: null }),
  canUseFeature: (feature) => {
    const { currentPlan } = get();
    if (currentPlan === 'studio') return true;
    if (currentPlan === 'pro') {
      return ['investor_match_pro', 'automated_outreach', 'data_room_analytics', 'data_room_security'].includes(feature);
    }
    return false; // free has none of these premium features
  }
}));
