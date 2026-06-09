import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designSystem } from "../../../lib/design-system";
import { X, Share, Users, Shield, Link as LinkIcon, Lock } from "lucide-react";
import { useBillingStore } from '../../../lib/store/useBillingStore';
import { PlanGuard } from '../billing/PlanGuard';
import { trackTemplateEvent } from '../../../lib/analytics';

export const DataRoomShareLinkBuilder: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { colors, typography, shadows } = designSystem;
  const [step, setStep] = useState(1);
  const { openUpgradeModal } = useBillingStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 relative z-10 hidden sm:flex">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-1 rounded-full ${step >= 1 ? "bg-indigo-600" : "bg-slate-200"}`}
              />
              <div
                className={`w-8 h-1 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-slate-200"}`}
              />
              <div
                className={`w-8 h-1 rounded-full ${step >= 3 ? "bg-indigo-600" : "bg-slate-200"}`}
              />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-sans text-slate-900">
                    Create Data Room Link
                  </h2>
                  <p className="text-sm text-slate-500">
                    Configure access permissions for this custom link.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-indigo-200 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="access"
                        defaultChecked
                        className="mt-1 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-slate-800 font-sans flex items-center gap-2">
                          <Users size={16} className="text-indigo-600" />{" "}
                          General Access
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Anyone with the link can view pitch deck. Other
                          folders require an email address.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div 
                    onClick={() => openUpgradeModal('data_room_security')}
                    className="p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors opacity-80 group"
                  >
                    <div className="flex items-start gap-3 pointer-events-none">
                      <input
                        type="radio"
                        name="access"
                        disabled
                        className="mt-1 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-slate-800 font-sans flex items-center gap-2">
                          <Shield size={16} className="text-slate-600" /> Strict
                          Access{" "}
                          <span className="ml-2 px-2 py-0.5 bg-gradient-to-br from-[#C9A84C] to-[#F5A623] text-white text-[10px] uppercase font-bold rounded">
                            Pro
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Require signed NDA and verified email before viewing
                          any files.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-slate-800">
                    Security Settings
                  </h4>

                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">
                      Disable Downloads
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label 
                     onClick={(e) => { e.preventDefault(); openUpgradeModal('data_room_security') }} 
                     className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <span className="text-sm font-medium text-slate-700 opacity-60 flex items-center gap-2">
                      Link Expiry (Days){" "}
                      <Lock size={12} className="text-amber-500" />
                    </span>
                    <input
                      type="number"
                      disabled
                      placeholder="Pro only"
                      className="w-24 px-2 py-1 bg-slate-100 border border-slate-200 rounded text-sm text-right text-slate-400 pointer-events-none"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-sans text-slate-900">
                    Personalize Message
                  </h2>
                  <p className="text-sm text-slate-500">
                    Provide context for the investor when they open the link.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Link Name (Internal)
                    </label>
                    <input
                      type="text"
                      defaultValue="Q4 Seed Round - General"
                      className="w-full px-4 py-2 border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Welcome Message
                    </label>
                    <textarea
                      className="w-full h-32 px-4 py-3 border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-sm text-slate-900 resize-none"
                      defaultValue="Hi! Here's the data room for Acme Corp's Seed round. You'll find our latest deck and financial model inside. Let me know if you have any questions."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-2xl mb-4 shadow-sm">
                  <LinkIcon size={32} />
                </div>

                <h2 className="text-2xl font-bold font-sans text-slate-900 mb-2">
                  Link Generated
                </h2>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Your secure data room link is ready. Investors will see the
                  welcome message when they open it.
                </p>

                <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-600 truncate mr-4 block w-full text-left">
                    https://vault.africa/r/cm128dx91
                  </span>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap">
                    Copy Link
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                  You can track opens and views in the Outreach Tracker.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between">
            <button
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              onClick={() => {
                if (step === 2) {
                  import('../../../lib/analytics').then(({ track }) => {
                    track('data_room_link_created', { source: 'builder' });
                    track('shared_link_created', { type: 'data_room', link_id: 'temp', owner_id: 'unknown' });
                  });
                  setStep(3);
                } else if (step < 3) {
                  setStep(step + 1);
                } else {
                  onClose(); // TODO: Add real handling / save
                }
              }}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {step === 3 ? "Done" : "Next"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
