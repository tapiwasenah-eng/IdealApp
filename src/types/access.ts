// src/types/access.ts

export type SubscriptionTier = 'guest' | 'free' | 'pro' | 'enterprise';

export interface UserAccess {
  tier: SubscriptionTier;
  usageCount: number;
  maxUsage: number;
  canExportPDF: boolean;
  canExportDOCX: boolean;
  canUseTemplates: boolean;
  canUseAI: boolean;
  teamMembersCount: number;
  maxTeamMembers: number;
}

export const TIER_LIMITS: Record<SubscriptionTier, Partial<UserAccess>> = {
  guest: {
    tier: 'guest',
    maxUsage: 3,
    canExportPDF: false,
    canExportDOCX: false,
    canUseTemplates: true,
    canUseAI: true,
    maxTeamMembers: 0,
  },
  free: {
    tier: 'free',
    maxUsage: 10,
    canExportPDF: true,
    canExportDOCX: false,
    canUseTemplates: true,
    canUseAI: true,
    maxTeamMembers: 1,
  },
  pro: {
    tier: 'pro',
    maxUsage: Infinity,
    canExportPDF: true,
    canExportDOCX: true,
    canUseTemplates: true,
    canUseAI: true,
    maxTeamMembers: 5,
  },
  enterprise: {
    tier: 'enterprise',
    maxUsage: Infinity,
    canExportPDF: true,
    canExportDOCX: true,
    canUseTemplates: true,
    canUseAI: true,
    maxTeamMembers: Infinity,
  },
};
