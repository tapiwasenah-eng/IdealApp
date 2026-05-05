// src/components/TemplateGate.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAccessStore } from '../store/accessStore';
import { Link } from 'react-router-dom';

interface TemplateGateProps {
  children: React.ReactNode;
  isPremium?: boolean;
}

export const TemplateGate: React.FC<TemplateGateProps> = ({ children, isPremium = false }) => {
  const { tier, canPerformAction } = useAccessStore();
  const isLocked = (isPremium && tier !== 'pro' && tier !== 'enterprise') || !canPerformAction('template');

  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative group">
      <div className="blur-[2px] pointer-events-none opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-2xl border border-dashed border-zinc-200">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow-xl border border-zinc-100 text-center max-w-[240px]"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <h4 className="text-sm font-bold text-[#111827] mb-2">
            {isPremium ? 'Premium Template' : 'Usage Limit Reached'}
          </h4>
          <p className="text-xs text-zinc-500 mb-4">
            {isPremium 
              ? 'This template is only available for Pro members.' 
              : 'You have reached your free generation limit.'}
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all"
          >
            Upgrade Now
            <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
