import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Mail, Eye, Network } from 'lucide-react';
import { designSystem } from '../../lib/design-system';
import { useCompanyDNAStore } from '../../lib/store/useCompanyDNAStore';
import { useDocumentStore } from '../../lib/store/useDocumentStore';
import { usePitchPackagesStore } from '../../lib/store/usePitchPackagesStore';
import { useNavigate } from 'react-router-dom';
import { InvestorCallSummaryCard } from '../../components/dashboard/InvestorCallSummaryCard';

const MOCK_NUDGES = [
  { id: '1', text: "Your Series A deck hasn't been updated in 12 days.", action: 'Update assets →', type: 'warning', label: 'CRITICAL', icon: Sparkles, iconColor: 'text-purple-500' },
  { id: '2', text: "3 Top-tier VCs viewed your data room in the last 24h.", action: 'View analytics →', type: 'info', label: 'INSIGHT', icon: Network, iconColor: 'text-indigo-400' },
  { id: '3', text: "Founder at Stripe is available for an intro to Sequoia.", action: 'Request Intro →', type: 'premium', label: 'OUTREACH', icon: Mail, iconColor: 'text-purple-400' }
];

export const DashboardOverview: React.FC = () => {
  const { colors, typography, spacing, radii, shadows } = designSystem;
  const navigate = useNavigate();
  const { documents, loadAllDocuments } = useDocumentStore();
  const { records, loadRecords } = usePitchPackagesStore();
  
  useEffect(() => {
    loadAllDocuments();
    loadRecords();
  }, [loadAllDocuments, loadRecords]);

  return (
    <div className="flex flex-col gap-10 bg-[#fbfcff] min-h-screen p-2 md:p-6 lg:p-8">
      
      {/* Priority Actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">Priority Actions</h2>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-slate-600 transition-colors"><ChevronLeft size={16} /></button>
            <button className="hover:text-slate-600 transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {MOCK_NUDGES.map((nudge, i) => (
            <motion.div 
              key={nudge.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-[340px] p-6 rounded-none snap-start bg-white"
              style={{
                border: '1px solid rgba(236,72,153,0.3)', // subtle pinkish border to match reference
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <nudge.icon size={22} className={nudge.iconColor} strokeWidth={1.5} />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{nudge.label}</span>
              </div>
              <p className="text-[17px] font-bold text-slate-900 leading-snug mb-5 font-sans">
                {nudge.text}
              </p>
              <button className="text-[14px] font-bold text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1 font-sans">
                {nudge.action}
              </button>
            </motion.div>
          ))}
          
          <div className="flex-shrink-0 w-[420px] snap-start">
             <InvestorCallSummaryCard 
               investorName="Hemant Taneja (General Catalyst)"
               date="Today, 2:30 PM"
               summary={{
                  objections: ["Churn rate is too high in SMB segment.", "Requires more clarity on GTM strategy."],
                  interests: ["Loved the AI onboarding feature.", "Impressed by enterprise pilot pipeline."],
                  nextSteps: "Send updated financial model reflecting enterprise contracts."
               }}
               onApplyInsights={() => {}}
             />
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard label="Documents Created" value="24" highlight="+12%" highlightColor="text-emerald-500" />
        <MetricCard label="Outreach Ratio" value="68%" highlight="Stable" highlightColor="text-amber-500" />
        <MetricCard label="Data Room Views" value="1.2k" highlight="+85%" highlightColor="text-emerald-500" />
        <MetricCard label="Match Score" value="9.4" highlight="Elite" highlightColor="text-orange-500" />
      </section>

      {/* Live Investor Activity */}
      <section className="bg-[#fcfdfd] border-t border-slate-100 -mx-2 md:-mx-6 lg:-mx-8 px-2 md:px-6 lg:px-8 py-8 relative">
        <div className="absolute inset-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)] rounded-t-[40px] z-[-1]"></div>
        <div className="flex items-center justify-between mb-8 overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100/50 p-6">
           <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                   Live Investor Activity <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                 </h2>
                 <button className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">View CRM</button>
              </div>

              <div className="w-full overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-slate-100">
                       <th className="pb-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase px-4 w-[30%]">Firm</th>
                       <th className="pb-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase px-4 w-[30%]">Lead Partner</th>
                       <th className="pb-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase px-4 w-[20%] text-center">Status</th>
                       <th className="pb-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase px-4 w-[20%] text-right">Last Activity</th>
                     </tr>
                   </thead>
                   <tbody>
                     <ActivityRow initials="GC" color="bg-indigo-600" firm="General Catalyst" partner="Hemant Taneja" status="Sent" statusColor="text-slate-500" time="Just now" />
                     <ActivityRow initials="KV" color="bg-slate-900" firm="Khosla Ventures" partner="Vinod Khosla" status="Engaged" statusColor="text-emerald-500" dot time="Just now" />
                     <ActivityRow initials="GC" color="bg-indigo-600" firm="General Catalyst" partner="Hemant Taneja" status="Engaged" statusColor="text-emerald-500" time="Just now" />
                     <ActivityRow initials="GC" color="bg-indigo-600" firm="General Catalyst" partner="Hemant Taneja" status="Sent" statusColor="text-slate-500" time="Just now" />
                     <ActivityRow initials="GC" color="bg-indigo-600" firm="General Catalyst" partner="Hemant Taneja" status="Opened" statusColor="text-blue-500" time="Just now" />
                     <ActivityRow initials="AC" color="bg-amber-500" firm="Accel" partner="Rich Wong" status="Engaged" statusColor="text-emerald-500" dot time="Just now" />
                     <ActivityRow initials="GC" color="bg-indigo-600" firm="General Catalyst" partner="Hemant Taneja" status="Opened" statusColor="text-blue-500" time="Just now" />
                   </tbody>
                 </table>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

const MetricCard = ({ label, value, highlight, highlightColor }: { label: string, value: string, highlight: string, highlightColor: string }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 flex flex-col justify-center h-[140px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-2">
         <span className="text-[11px] font-bold text-slate-400 tracking-wide bg-indigo-50/50 px-2 py-0.5 rounded text-indigo-900/60">{label.split(' ')[0]}</span>
         <span className="text-[11px] font-bold text-slate-400 tracking-wide">{label.split(' ').slice(1).join(' ')}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-sans text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{value}</span>
        <span className={`text-[12px] font-bold tracking-wide ${highlightColor}`}>{highlight}</span>
      </div>
    </div>
  );
};

const ActivityRow = ({ initials, color, firm, partner, status, statusColor, time, dot }: any) => {
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group">
      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-white text-[11px] font-bold ${color}`}>
            {initials}
          </div>
          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{firm}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-slate-500 font-medium">{partner}</td>
      <td className="py-4 px-4 text-center">
         <span className={`font-bold text-[13px] flex items-center justify-center gap-2 ${statusColor}`}>
           {dot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
           {status}
         </span>
      </td>
      <td className="py-4 px-4 text-right text-slate-400 font-medium text-sm">{time}</td>
    </tr>
  );
}
