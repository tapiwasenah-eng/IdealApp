import React, { useState } from "react";
import { useInvestorStore } from "../../../lib/store/useInvestorStore";
import { useCompanyDNAStore } from "../../../lib/store/useCompanyDNAStore";
import { designSystem } from "../../../lib/design-system";
import { X, Lock, CheckCircle2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PitchPackageBuilder } from "./PitchPackageBuilder";
import { PlanGuard } from "../billing/PlanGuard";
import { useBillingStore } from "../../../lib/store/useBillingStore";

export const InvestorProfileDrawer: React.FC = () => {
  const { investors, selectedInvestorId, setSelectedInvestor } = useInvestorStore();
  const { dna } = useCompanyDNAStore();
  const { colors, typography, shadows } = designSystem;
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { canUseFeature, openUpgradeModal } = useBillingStore();

  const investor = investors.find((i) => i.id === selectedInvestorId);

  return (
    <>
      <AnimatePresence>
        {investor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 z-40 backdrop-blur-sm"
              onClick={() => setSelectedInvestor(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
                <h2
                  style={{
                    fontFamily: typography.fonts.interface,
                    fontWeight: 600,
                    fontSize: typography.scale.h3.fontSize,
                  }}
                >
                  Investor Profile
                </h2>
                <button
                  onClick={() => setSelectedInvestor(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
                {investor.isLocked && !canUseFeature('investor_match_pro') && (
                  <div className="absolute inset-x-6 top-6 bottom-6 z-20 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 border border-amber-200 rounded-2xl shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#F5A623] text-white flex flex-col items-center justify-center mb-4 shadow-lg">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 font-sans">
                      Unlock Premium Match Data
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 font-medium">
                      Get access to this investor's recent investments, exact
                      criteria, and personalized introduction pathways.
                    </p>
                    <button 
                      onClick={() => openUpgradeModal('investor_match_pro')}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all"
                    >
                      Upgrade to Pro — $49/mo
                    </button>
                  </div>
                )}

                {/* Header Info */}
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-2xl border border-slate-200">
                    {investor.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold font-sans text-slate-900">
                      {investor.name}
                    </h1>
                    <p className="text-lg font-medium text-slate-500">
                      {investor.role} at{" "}
                      <span className="text-indigo-600">{investor.firm}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsBuilderOpen(true)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm flex flex-col items-center justify-center"
                  >
                    <div className="flex items-center gap-1.5">
                      <Send size={16} /> Build Pitch Package
                    </div>
                  </button>
                  <button className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold text-sm transition-colors border border-slate-200 shadow-sm">
                    Research
                  </button>
                </div>

                {/* AI Match Analysis */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs font-mono">
                      {investor.matchScore}% Match
                    </div>
                    <h3 className="font-semibold text-indigo-900">
                      AI Analysis vs. {dna.identity.name || "Your DNA"}
                    </h3>
                  </div>
                  <p className="text-sm text-indigo-800 leading-relaxed mb-4 font-medium italic">
                    "{investor.explanation}"
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Sector alignment:</span>{" "}
                        Strong affinity for{" "}
                        {dna.identity.tagline || "your sector"}.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Stage fit:</span>{" "}
                        Currently deploying {investor.checkSize} checks in{" "}
                        {dna.fundraising.stage || "your stage"}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Criteria */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">
                    Investment Criteria
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                        Check Size
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-700">
                        {investor.checkSize}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                        Focus
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {investor.sectorTags[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {investor.stageTags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded"
                      >
                        {t}
                      </span>
                    ))}
                    {investor.sectorTags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thesis */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 uppercase tracking-wider text-xs">
                    Firm Thesis
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-400">
                    {investor.thesis}
                  </p>
                </div>

                {/* Portfolio */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">
                    Notable Portfolio
                  </h3>
                  <div className="flex gap-3">
                    {investor.portfolioLogos.map((logo, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 shadow-sm"
                      >
                        {logo}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <PitchPackageBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        initialInvestor={investor}
      />
    </>
  );
};
