import React from 'react';
import { Video, Calendar, Sparkles, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function InvestorCallSummaryCard() {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/data-room')} className="glass-panel p-6 rounded-2xl border border-trust-blue/20 bg-trust-blue/5 cursor-pointer hover:bg-trust-blue/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-trust-blue/20 flex items-center justify-center text-trust-blue border border-trust-blue/30">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Sequoia Capital Intro</h4>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>Oct 24, 2026</span>
              <span>•</span>
              <span>45m duration</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-space-indigo/20 to-electric-violet/20 border border-space-indigo/30 text-xs font-semibold text-white">
          <Sparkles className="w-3 h-3 text-electric-violet" />
          AI Summary Ready
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-obsidian/40 rounded-xl p-4 border border-white/5">
          <h5 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">Key Takeaways</h5>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-white/90">
              <CheckCircle2 className="w-4 h-4 text-plasma-green shrink-0 mt-0.5" />
              <span>Strong interest in the automated data room architecture; requested deeper technical dive.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-white/90">
              <CheckCircle2 className="w-4 h-4 text-plasma-green shrink-0 mt-0.5" />
              <span>Partner identified overlap with current portfolio, specifically highlighting go-to-market synergies.</span>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-trust-blue font-medium">
            <FileText className="w-4 h-4" />
            <span>Transcript & Commitments extracted</span>
          </div>
          <button className="text-white hover:text-electric-violet transition-colors flex items-center gap-1 font-medium">
            View Full Brief <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
