// src/components/AIGenerationGate.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useAccessStore } from '../store/accessStore';
import { Link } from 'react-router-dom';

interface AIGenerationGateProps {
  children: React.ReactNode;
}

export const AIGenerationGate: React.FC<AIGenerationGateProps> = ({ children }) => {
  const { canPerformAction, tier } = useAccessStore();
  const isLocked = !canPerformAction('ai');

  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative p-8 rounded-3xl bg-zinc-50 border border-zinc-200 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-[#111827] tracking-tight">AI Generation Limit Reached</h3>
        <p className="text-zinc-500 max-w-sm mx-auto">
          You've used all your free generations. Upgrade to Pro for unlimited AI-powered document creation.
        </p>
      </div>
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/pricing"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          Upgrade to Pro
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          to="/dashboard"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-bold text-sm hover:border-zinc-300 hover:text-[#111827] transition-all shadow-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
