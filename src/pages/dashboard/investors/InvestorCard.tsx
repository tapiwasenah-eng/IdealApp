import React from "react";
import {
  Investor,
  useInvestorStore,
} from "../../../lib/store/useInvestorStore";
import { designSystem } from "../../../lib/design-system";
import { Lock } from "lucide-react";
import { useBillingStore } from '../../../lib/store/useBillingStore';

export const InvestorCard: React.FC<{ investor: Investor }> = ({
  investor,
}) => {
  const { colors, typography, shadows, componentVariants } = designSystem;
  const { setSelectedInvestor } = useInvestorStore();
  const { canUseFeature, openUpgradeModal } = useBillingStore();

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 80) return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-slate-700 bg-slate-50 border-slate-200";
  };

  return (
    <div
      onClick={() => setSelectedInvestor(investor.id)}
      className="bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer relative overflow-hidden transition-all duration-200 group hover:border-indigo-300 hover:shadow-md"
      style={{ boxShadow: shadows.e1 }}
    >
      {investor.isLocked && !canUseFeature('investor_match_pro') && (
        <div 
          onClick={(e) => { e.stopPropagation(); openUpgradeModal('investor_match_pro'); }}
          className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[4px] flex items-center justify-center hover:bg-white/50 transition-colors"
        >
          <div className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg">
            <Lock size={16} className="text-amber-400" />
            Unlock with Pro
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg border border-slate-200">
            {investor.name.charAt(0)}
          </div>
          <div>
            <h3
              style={{
                fontFamily: typography.fonts.interface,
                fontWeight: 600,
                fontSize: typography.scale.h4.fontSize,
                color: colors.primary.obsidian,
              }}
            >
              {investor.name}
            </h3>
            <p className="text-sm font-medium text-slate-500">
              {investor.role} at{" "}
              <span className="text-indigo-600">{investor.firm}</span>
            </p>
          </div>
        </div>
        <div
          className={`px-2.5 py-1 rounded-md border inline-flex flex-col items-center justify-center ${getScoreColor(investor.matchScore)}`}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-80 leading-tight">
            Match
          </span>
          <span className="font-mono text-lg font-bold leading-tight">
            {investor.matchScore}%
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
        "{investor.explanation}"
      </p>

      <div className="flex flex-wrap gap-2">
        {investor.sectorTags.map((t) => (
          <span
            key={t}
            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded"
          >
            {t}
          </span>
        ))}
        {investor.stageTags.map((t) => (
          <span
            key={t}
            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};
