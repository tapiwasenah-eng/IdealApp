import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DataRoomDocument } from "../../../lib/store/useDataRoomStore";
import { designSystem } from "../../../lib/design-system";
import { X, Sparkles, CheckCircle2 } from "lucide-react";

interface Props {
  document: DataRoomDocument | null;
  onClose: () => void;
}

export const DataRoomAISummaryPanel: React.FC<Props> = ({
  document,
  onClose,
}) => {
  const { typography, colors } = designSystem;

  return (
    <AnimatePresence>
      {document && (
        <>
          {/* Overlay for mobile only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden absolute inset-0 bg-slate-900/20 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute md:relative top-0 right-0 h-full w-full md:w-[400px] flex-shrink-0 bg-white border-l border-slate-200 shadow-xl md:shadow-none z-50 flex flex-col"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles size={18} />
                <h3
                  style={{
                    fontFamily: typography.fonts.interface,
                    fontWeight: 600,
                    fontSize: typography.scale.bodyM.fontSize,
                  }}
                >
                  AI Investor Brief
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Analyzing
                </p>
                <h2 className="text-lg font-bold font-sans text-slate-900">
                  {document.name}
                </h2>
                <p className="text-sm text-slate-500">{document.type}</p>
              </div>

              {/* Mock AI Output */}
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 relative">
                {/* Small indicator */}
                <div className="absolute -top-2.5 -right-2.5 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 border-2 border-white">
                  <Sparkles size={10} /> Auto-generated
                </div>

                <h3 className="font-semibold text-slate-800 mb-3 text-sm">
                  Key Takeaways
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  This document highlights Acme Corp's traction ($12k MRR, 15%
                  MoM growth) and details the ambient AI architecture. It
                  positions the company as a leader in workflow automation for
                  legal services.
                </p>

                <h3 className="font-semibold text-slate-800 mb-3 text-sm mt-6">
                  Strengths for Investors
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 mt-0.5"
                    />
                    <p className="text-sm text-slate-700">
                      Clear path to $1M ARR via enterprise expansion.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 mt-0.5"
                    />
                    <p className="text-sm text-slate-700">
                      Defensible tech moat with proprietary ML pipeline.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 mt-0.5"
                    />
                    <p className="text-sm text-slate-700">
                      Strong founder-market fit (ex-corporate law).
                    </p>
                  </div>
                </div>
              </div>

              {/* Explain how this is used */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  This brief is visible to you. A tailored version of this
                  summary is used to draft personalized outreach emails in the
                  Pitch Package Builder.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
