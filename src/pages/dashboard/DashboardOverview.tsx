import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileBarChart, Lock, Eye, Compass, Copy, Trash2, Edit2, Share2, Download } from 'lucide-react';
import { designSystem } from '../../lib/design-system';
import { useCompanyDNAStore } from '../../lib/store/useCompanyDNAStore';
import { useDocumentStore } from '../../lib/store/useDocumentStore';
import { useBillingStore } from '../../lib/store/useBillingStore';
import { useNavigate } from 'react-router-dom';
import { PlanGuard as DashboardPlanGuard } from './billing/PlanGuard';

const MOCK_NUDGES = [
  { id: '1', text: "Your Series A deck hasn't been updated in 8 days. Investor meetings are approaching. Refresh it?", action: 'Refresh it? →', type: 'warning' },
  { id: '2', text: "You have 3 new investor matches based on your traction update. View matches →", action: 'View matches →', type: 'premium', locked: true },
  { id: '3', text: "Your data room link was viewed 3 times today. See who →", action: 'See who →', type: 'info' }
];

export const DashboardOverview: React.FC = () => {
  const { colors, typography, spacing, radii, shadows } = designSystem;
  const navigate = useNavigate();
  const { canUseFeature, openUpgradeModal } = useBillingStore();
  const { documents, loadAllDocuments } = useDocumentStore();
  
  useEffect(() => {
    loadAllDocuments();
  }, [loadAllDocuments]);

  // Fallback to empty array if not loaded yet
  const recentDocs = documents.slice(0, 3);

  
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      
      {/* Primary Content (Left) */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* Nudges */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {MOCK_NUDGES.map((nudge, i) => {
             const isLockedNudge = nudge.locked && !canUseFeature('investor_match_pro');
             return (
            <motion.div 
              key={nudge.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex-shrink-0 w-[300px] p-5 rounded-2xl border relative flex flex-col justify-between ${isLockedNudge ? 'cursor-pointer hover:border-amber-300 transition-colors' : ''}`}
              style={{
                backgroundColor: 'white',
                borderColor: nudge.type === 'premium' ? colors.accent.investorGold : 'rgba(0,0,0,0.06)',
                boxShadow: shadows.e1
              }}
              onClick={() => isLockedNudge ? openUpgradeModal('investor_match_pro') : null}
            >
              {isLockedNudge && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#C9A84C] to-[#F5A623] text-[#0A0A0F] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">Pro</div>
              )}
              <p style={{ fontFamily: typography.fonts.interface, fontSize: typography.scale.bodyS.fontSize, color: colors.neutral.slate[700], lineHeight: 1.5, marginBottom: spacing.scale[4] }}>
                {nudge.text.replace(nudge.action, '')}
              </p>
              <button 
                onClick={(e) => {
                  if (isLockedNudge) {
                    e.stopPropagation();
                    openUpgradeModal('investor_match_pro');
                  }
                }}
                className="text-left font-semibold hover:underline" style={{
                fontFamily: typography.fonts.interface, 
                fontSize: typography.scale.bodyS.fontSize,
                color: nudge.type === 'premium' ? colors.accent.investorGold : colors.primary.spaceIndigo 
              }}>
                {nudge.action}
              </button>
            </motion.div>
          )})}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Documents Created" value="5" trend={+2} />
          <MetricCard label="Outreach Ratio" value="12%" feature="automated_outreach" />
          <MetricCard label="Data Room Views" value="28" feature="data_room_analytics" />
          <MetricCard label="Top Match Score" value="94%" feature="investor_match_pro" highlight />
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h4.fontSize, color: colors.primary.obsidian }}>Recent Documents</h3>
            <button className="text-sm font-medium text-indigo-600 hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 shadow-sm rounded-2xl overflow-hidden border border-slate-100 bg-white">
            {recentDocs.map((doc, idx) => (
              <div key={doc.id} onClick={() => navigate(`/documents/${doc.id}`)} className="p-5 border-b border-r border-slate-100 group relative flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-16 h-20 bg-slate-100 rounded-lg border border-slate-200 flex-shrink-0 shadow-sm flex items-center justify-center text-slate-300">
                  <FileText size={24} strokeWidth={1} />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h4 className="font-semibold text-slate-900 truncate mb-1" style={{ fontFamily: typography.fonts.interface }}>{doc.title || doc.type}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${designSystem.componentVariants.badge.base} ${designSystem.componentVariants.badge.docType.pitchDeck} !py-0.5 !px-2 !text-[10px]`}>{doc.type}</span>
                    <span className={`${designSystem.componentVariants.badge.base} ${designSystem.componentVariants.badge.status.inReview} !py-0.5 !px-2 !text-[10px]`}>{doc.sections.length > 0 ? "In Progress" : "Started"}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium font-sans">Edited recently</p>
                </div>
                
                {/* Hover Quick Actions */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
                  <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={14} /></button>
                  <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Share2 size={14} /></button>
                  <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Download size={14} /></button>
                </div>
              </div>
            ))}
            {/* Empty slot for grid balance if needed */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-center">
               <button className="text-sm font-medium text-slate-400 border border-dashed border-slate-300 rounded-xl px-4 py-8 w-full hover:bg-slate-50 hover:text-indigo-500 transition-colors">
                 + Generate another document
               </button>
            </div>
          </div>
        </div>

      </div>

      {/* Side Content (Right) */}
      <div className="w-full xl:w-[320px] flex flex-col gap-6 flex-shrink-0">
        <CompanyDNAWidget />
        
        {/* Investor Activity Teaser */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.08)] relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Compass size={18} className="text-slate-400" />
            <h3 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.bodyM.fontSize, color: colors.primary.obsidian }}>Investor Activity</h3>
          </div>
          
          <DashboardPlanGuard feature="data_room_analytics" blur>
            <div className="space-y-3 opacity-40">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="font-medium">Sequoia</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">Opened</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="font-medium">a16z</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Engaged</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Index</span>
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs">Sent</span>
              </div>
            </div>
          </DashboardPlanGuard>
        </div>
      </div>

    </div>
  );
};

const MetricCard = ({ label, value, trend, feature, highlight }: { label: string, value: string, trend?: number, feature?: any, highlight?: boolean }) => {
  const { colors, typography, radii, shadows } = designSystem;
  const { canUseFeature, openUpgradeModal } = useBillingStore();
  const isLocked = feature && !canUseFeature(feature);

  return (
    <div 
       className={`bg-white p-5 rounded-2xl border relative overflow-hidden flex flex-col justify-between h-[120px] ${isLocked ? 'cursor-pointer hover:border-indigo-300 transition-colors' : ''}`} 
       style={{
         borderColor: highlight ? colors.accent.investorGold : 'rgba(0,0,0,0.06)',
         boxShadow: shadows.e1
       }}
       onClick={() => isLocked ? openUpgradeModal(feature) : null}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center hover:bg-white/30 transition-colors">
          <Lock size={16} className="text-slate-400 mb-1" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pro</span>
        </div>
      )}
      
      <p style={{ fontFamily: typography.fonts.interface, fontSize: typography.scale.micro.fontSize, color: colors.neutral.slate[500], fontWeight: 500, letterSpacing: '0.04em' }}>{label}</p>
      
      <div className="flex items-end justify-between">
        <span style={{ fontFamily: typography.fonts.mono, fontSize: typography.scale.metric.fontSize, fontWeight: 700, color: highlight ? colors.accent.investorGold : colors.primary.obsidian, lineHeight: 1 }}>{value}</span>
        {trend && (
           <span className="text-emerald-500 text-xs font-bold mb-1 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">↑ {trend}</span>
        )}
      </div>
    </div>
  );
};

const CompanyDNAWidget = () => {
  const { colors, typography, radii, shadows } = designSystem;
  const { dna, getStrengthPercentage } = useCompanyDNAStore();
  const navigate = useNavigate();
  const strength = getStrengthPercentage();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col" style={{ boxShadow: shadows.e1 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileBarChart size={16} />
          </div>
          <h3 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.bodyM.fontSize, color: colors.primary.obsidian }}>Company DNA</h3>
        </div>
        <button onClick={() => navigate('/dashboard/dna')} className="text-xs font-semibold text-indigo-600 hover:underline">Edit DNA →</button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-end mb-1.5">
          <span style={{ fontFamily: typography.fonts.interface, fontSize: typography.scale.micro.fontSize, color: colors.neutral.slate[500] }}>Strength</span>
          <span style={{ fontFamily: typography.fonts.mono, fontSize: typography.scale.bodyS.fontSize, fontWeight: 700, color: colors.primary.spaceIndigo }}>{strength}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all" style={{ width: `${strength}%` }}></div>
        </div>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Your Company DNA is {strength}% complete. A stronger profile = better AI output.
        </p>
      </div>

      <div className="space-y-2">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Name</span>
          <span className="text-sm font-medium text-slate-800">{dna.identity.name || 'Not set'}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Sector & Stage</span>
          <span className="text-sm font-medium text-slate-800">{dna.identity.tagline} · {dna.fundraising.stage}</span>
        </div>
        <div className="flex items-center gap-2 mt-3 cursor-text">
           <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded truncate max-w-full">MRR: {dna.traction.mrr || '??'}</span>
           <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded truncate max-w-full">Growth: {dna.traction.growthRate || '??'}</span>
        </div>
      </div>
    </div>
  );
};
