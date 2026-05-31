import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBillingStore } from '../../../lib/store/useBillingStore';
import { X, CheckCircle2, Zap } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, closeUpgradeModal, upgradeModalFeature, setPlan } = useBillingStore();

  if (!isUpgradeModalOpen) return null;

  const featureContexts = {
    investor_match_pro: 'Unlock unlimited AI investor matches and detailed thesis analysis.',
    automated_outreach: 'Send pitch packages directly and automate your follow-ups.',
    data_room_analytics: 'See exact slide-by-slide analytics and engagement times.',
    data_room_security: 'Require NDAs and email verification before viewing documents.',
    custom_domain: 'Use your own custom domain for data room links.'
  };

  const contextMessage = upgradeModalFeature 
    ? featureContexts[upgradeModalFeature] 
    : 'Upgrade to vault Pro to superpower your fundraise.';

  const handleUpgrade = () => {
    setPlan('pro');
    closeUpgradeModal();
    // TODO: Navigate to real checkout session
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={closeUpgradeModal}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
           <div className="bg-slate-900 px-6 py-8 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <button onClick={closeUpgradeModal} className="text-white/50 hover:text-white transition-colors">
                  <X size={20} />
                </button>
             </div>
             
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#F5A623] text-white flex items-center justify-center mx-auto mb-4 shadow-lg transform -rotate-3">
               <Zap size={24} className="fill-white" />
             </div>
             <h2 className="text-2xl font-bold text-white font-sans mb-2 tracking-tight">Upgrade to Pro</h2>
             <p className="text-slate-300 text-sm">{contextMessage}</p>
           </div>
           
           <div className="p-6 bg-white">
             <ul className="space-y-4 mb-8">
                {[
                  'Unlimited AI Investor Matches',
                  'Slide-by-slide Analytics',
                  'Automated outreach & follow-ups',
                  'Smart access controls (NDA)',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={handleUpgrade}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Upgrade now — $49/mo
              </button>
              <p className="text-xs text-slate-400 text-center mt-4">Cancel anytime. Billed annually or $59 monthly.</p>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
