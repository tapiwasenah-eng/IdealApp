import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designSystem } from "../../../lib/design-system";
import { useBillingStore } from "../../../lib/store/useBillingStore";
import { Investor } from "../../../lib/store/useInvestorStore";
import { usePitchPackagesStore } from "../../../lib/store/usePitchPackagesStore";
import { X, FileText, Sparkles, Send, Lock } from "lucide-react";

export const PitchPackageBuilder: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialInvestor?: Investor | null;
}> = ({ isOpen, onClose, initialInvestor }) => {
  const { colors, typography, shadows } = designSystem;
  const [step, setStep] = useState(1);
  const { openUpgradeModal, canUseFeature } = useBillingStore();
  const { updateRecord } = usePitchPackagesStore();

  if (!isOpen) return null;

  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set(["doc1"]));
  const availableDocs = [
    { id: "doc1", name: "Seed Pitch Deck v3" },
    { id: "doc2", name: "Financial Model 3 YR" },
    { id: "doc3", name: "Executive Summary" }
  ];

  const toggleDoc = (id: string) => {
    const newDocs = new Set(selectedDocs);
    if (newDocs.has(id)) newDocs.delete(id);
    else newDocs.add(id);
    setSelectedDocs(newDocs);
  };
  
  const handleFinish = async () => {
    if (selectedDocs.size === 0) {
      setErrorMsg("Please select at least one document.");
      setStep(1);
      return;
    }

    if (initialInvestor) {
      setIsSending(true);
      setErrorMsg("");
      try {
        // 1. Create real Data Room Link
        const linkRes = await fetch('/api/data-room-links/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentIds: Array.from(selectedDocs),
            permissions: {
              allowDownload: true,
              hasPassword: false
            },
            label: `Pitch to ${initialInvestor.name}`
          })
        });

        const linkData = await linkRes.json();
        if (!linkRes.ok || !linkData.success) {
          throw new Error(linkData.error || "Failed to create data room link");
        }

        const roomUrl = linkData.publicUrl;
        const roomToken = linkData.token;

        // 2. Send outreach
        const res = await fetch('/api/outreach/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailIds: ['investor@example.com'], // mock email for the firm
            investorName: initialInvestor.name,
            firm: initialInvestor.firm,
            dataRoomLink: roomUrl,
            roomToken: roomToken
          })
        });
        if (!res.ok) throw new Error('Failed to send outreach');
        
        await updateRecord({
          id: Date.now().toString(),
          investorId: initialInvestor.id,
          investorName: initialInvestor.name,
          firm: initialInvestor.firm,
          sentDate: "Just now",
          lastOpened: "--",
          timeSpent: "--",
          docsViewed: 0,
          status: "Sent"
        });
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "An error occurred");
      } finally {
        setIsSending(false);
        if (!errorMsg) onClose();
      }
    } else {
      onClose();
    }
  };

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

          {/* Content area */}
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-sans text-slate-900">
                  Select Pitch Documents
                </h2>
                <p className="text-sm text-slate-500">
                  Choose which materials to include in this data room link.
                </p>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {errorMsg}
                  </div>
                )}
                <div className="space-y-3">
                  {availableDocs.map((doc, i) => (
                    <label
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedDocs.has(doc.id)}
                          onChange={() => toggleDoc(doc.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex flex-col items-center justify-center text-indigo-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm font-sans">
                            {doc.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            PDF • Updated 2 hrs ago
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold font-sans text-slate-900">
                      Personalise Intro Message
                    </h2>
                    <p className="text-sm text-slate-500">
                      AI drafted this based on your DNA and{" "}
                      {initialInvestor?.name || "the investor"}'s thesis.
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
                    <Sparkles size={14} /> Refine
                  </button>
                </div>

                <div className="w-full relative">
                  <textarea
                    className="w-full h-[240px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans leading-relaxed"
                    defaultValue={`Hi ${initialInvestor?.name?.split(" ")[0] || "Investor"},\n\nI saw your recent investment in the AI workflow space and your thesis around professional services automation.\n\nAt Acme Corp, we're building an ambient AI assistant for mid-sized law firms. We've processed over 1M documents and reached $12K MRR growing 15% MoM.\n\nSince this aligns directly with your focus at ${initialInvestor?.firm || "your firm"}, I'd love to share our materials. I've included a personalized data room link containing our deck and financial model below.\n\nBest,\nFounder`}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex flex-col items-center justify-center mb-4 shadow-inner">
                    <Send size={24} className="ml-1" />
                  </div>
                  <h2 className="text-2xl font-bold font-sans text-slate-900 mb-2">
                    Ready to Send
                  </h2>
                  <p className="text-sm text-slate-500 max-w-[280px]">
                    Your pitch package is ready. The secure data room link will
                    track opens and time spent per slide.
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center justify-center text-center">
                    {errorMsg}
                  </div>
                )}

                {!canUseFeature('automated_outreach') && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                    <div className="mt-0.5">
                      <Lock size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 font-sans">
                        Automated Sending is a Pro Feature
                      </h4>
                      <p className="text-xs text-amber-700 mt-1 font-medium">
                        Drafts can be copied manually on the free tier. Upgrade to
                        send directly, automate follow-ups, and view
                        slide-by-slide analytics.
                      </p>
                      <button 
                        onClick={() => openUpgradeModal('automated_outreach')}
                        className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                )}
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
                if (step < 3) setStep(step + 1);
                else handleFinish();
              }}
              disabled={isSending}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSending ? "Processing..." : step === 3 ? "Send Package" : "Continue"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
