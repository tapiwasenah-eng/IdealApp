import React from 'react';
import { useBillingStore, PlanType } from '../../../lib/store/useBillingStore';
import { designSystem } from '../../../lib/design-system';
import { Sparkles, Zap, Building2 } from 'lucide-react';

export const PlanBadge: React.FC<{ plan?: PlanType }> = ({ plan }) => {
  const { currentPlan } = useBillingStore();
  const activePlan = plan || currentPlan;

  if (activePlan === 'free') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
        Free
      </span>
    );
  }
  
  if (activePlan === 'pro') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-gradient-to-br from-[#C9A84C] to-[#F5A623] text-white shadow-sm flex items-center gap-1">
        <Zap size={10} /> Pro
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-white shadow-sm flex items-center gap-1">
      <Building2 size={10} /> Studio
    </span>
  );
};
