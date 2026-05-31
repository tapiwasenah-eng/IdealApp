import React from 'react';
import { useBillingStore, FeatureKey } from '../../../lib/store/useBillingStore';
import { Lock } from 'lucide-react';

interface PlanGuardProps {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  blur?: boolean;
}

export const PlanGuard: React.FC<PlanGuardProps> = ({ feature, children, fallback, blur = false }) => {
  const { canUseFeature, openUpgradeModal } = useBillingStore();
  const hasAccess = canUseFeature(feature);

  if (hasAccess) return <>{children}</>;

  if (blur) {
    return (
      <div className="relative group overflow-hidden rounded-xl">
        <div className="blur border border-slate-200 pointer-events-none opacity-50 select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/40 backdrop-blur-[2px] z-10 transition-all opacity-0 group-hover:opacity-100">
          <button 
            onClick={() => openUpgradeModal(feature)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-slate-800 transition-colors"
          >
            <Lock size={16} className="text-amber-400" /> Unlock with Pro
          </button>
        </div>
      </div>
    );
  }

  if (fallback) return <>{fallback}</>;

  return null;
};
