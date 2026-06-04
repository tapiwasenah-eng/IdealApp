import React from 'react';
import { PhoneCall, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface InvestorCallSummaryCardProps {
  investorName: string;
  date: string;
  summary: {
    objections: string[];
    interests: string[];
    nextSteps: string;
  };
  onApplyInsights: () => void;
}

export function InvestorCallSummaryCard({ 
  investorName, 
  date, 
  summary, 
  onApplyInsights 
}: InvestorCallSummaryCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <PhoneCall size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Call Summary: {investorName}</h4>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <Clock size={12} />
              <span>{date}</span>
            </div>
          </div>
        </div>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1 border border-green-200">
          <CheckCircle size={14} /> Processed by Aura
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Interests</h5>
          <ul className="space-y-1">
            {summary.interests.map((intel, idx) => (
              <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span> {intel}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Objections / Risks</h5>
          <ul className="space-y-1">
            {summary.objections.map((intel, idx) => (
              <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span> {intel}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next Steps</h5>
          <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {summary.nextSteps}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
        <button 
          onClick={onApplyInsights}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <FileText size={16} />
          Apply Insights to Pitch Deck
        </button>
      </div>
    </motion.div>
  );
}
