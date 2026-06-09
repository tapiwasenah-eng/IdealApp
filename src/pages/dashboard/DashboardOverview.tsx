import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, Plus, Upload, Filter, Compass, Video } from 'lucide-react';
import { useCompanyDNAStore } from '../../lib/store/useCompanyDNAStore';
import { useDocumentStore } from '../../lib/store/useDocumentStore';
import { useBillingStore } from '../../lib/store/useBillingStore';
import { usePitchPackagesStore } from '../../lib/store/usePitchPackagesStore';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { formatDistanceToNow } from 'date-fns';

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { openNewDoc } = useOutletContext<{ openNewDoc: () => void }>();
  const { canUseFeature, openUpgradeModal } = useBillingStore();
  const { documents, loadAllDocuments } = useDocumentStore();
  const { records, loadRecords } = usePitchPackagesStore();
  const { dna, getStrengthPercentage, loadDNA } = useCompanyDNAStore();
  
  const user = useAppStore(state => state.user);

  const isPql = documents.length >= 2;

  const dynamicNudges = useMemo(() => {
    const nudges = [];
    if (isPql) {
      nudges.push({
        id: 'pql',
        title: 'UPGRADE TO PRO',
        text: "You're using IdealApp like our top Pro users. Unlock unlimited investor views & Pro templates.",
        action: 'View Pro Plans →',
        type: 'info',
        iconColor: 'text-emerald-400'
      });
    } else {
      nudges.push({
        id: '1',
        title: 'ACTIVATION',
        text: "Start your fundraising journey by getting your core materials ready.",
        action: 'Create your first investor-ready doc →',
        type: 'info',
        iconColor: 'text-indigo-400'
      });
    }
    nudges.push({
      id: '2',
      title: 'CRITICAL',
      text: "You haven't sent an investor update in 2 weeks.",
      action: 'Draft update →',
      type: 'warning',
      iconColor: 'text-rose-400'
    });
    return nudges;
  }, [isPql]);

  useEffect(() => {
    if (user) {
      loadAllDocuments();
      loadRecords();
      loadDNA();
    }
  }, [user, loadAllDocuments, loadRecords, loadDNA]);

  const recentDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      const aTime = (a as any).updated_at?.toMillis ? (a as any).updated_at.toMillis() : ((a as any).updated_at || (a as any).createdAt || 0);
      const bTime = (b as any).updated_at?.toMillis ? (b as any).updated_at.toMillis() : ((b as any).updated_at || (b as any).createdAt || 0);
      return bTime - aTime;
    }).slice(0, 4);
  }, [documents]);

  const todayStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric'}).format(new Date());

  const mDocs = { label: 'Documents Created', value: documents.length.toString(), trend: '' };
  const outreachTotal = records.length;
  const outreachActive = records.filter(r => (r.status as string) !== 'passed' && (r.status as string) !== 'to_contact').length;
  const ratio = outreachTotal > 0 ? Math.round((outreachActive / outreachTotal) * 100) : 0;
  
  const mOutreach = { label: 'Active Outreach', value: `${ratio}%`, trend: outreachTotal === 0 ? 'No data' : 'Active' };
  const mDataRoom = { label: 'Data Room Views', value: '0', trend: 'Just started' };
  
  const dnaScore = getStrengthPercentage();
  const mMatch = { label: 'DNA Score', value: `${dnaScore}%`, trend: dnaScore > 80 ? 'Elite' : 'Needs work' };

  return (
    <div className="flex flex-col gap-10 text-slate-100 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-50 flex items-center gap-3">
            Good morning, {dna.identity?.name || user?.displayName?.split(' ')[0] || 'Founder'}
            <span className="text-indigo-400">✨</span>
          </h1>
          <p className="text-slate-400 mt-1">{todayStr}</p>
        </div>
        <button 
          onClick={openNewDoc}
          className="inline-flex items-center gap-2 bg-white text-slate-950 font-medium px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Plus size={18} />
          New Document
        </button>
      </div>

      {/* Priority Actions */}
      <section>
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Priority Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dynamicNudges.map((nudge) => (
            <div key={nudge.id} className="bg-[#18181B] border border-slate-800/60 rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
               <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={nudge.iconColor}>✦</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${nudge.type === 'warning' ? 'text-rose-400' : 'text-indigo-400'}`}>{nudge.title}</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {nudge.text}
                  </p>
               </div>
               <button onClick={nudge.id === 'pql' ? () => navigate('/pricing') : openNewDoc} className={`text-sm text-left mt-4 ${nudge.type === 'warning' ? 'text-rose-400 hover:text-rose-300' : 'text-indigo-400 hover:text-indigo-300'}`}>
                 {nudge.action}
               </button>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics Row */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label={mDocs.label} value={mDocs.value} trend={mDocs.trend} tone="emerald" />
          <MetricCard label={mOutreach.label} value={mOutreach.value} trend={mOutreach.trend} tone="emerald" />
          <MetricCard label={mDataRoom.label} value={mDataRoom.value} trend={mDataRoom.trend} tone="emerald" />
          <MetricCard label={mMatch.label} value={mMatch.value} trend={mMatch.trend} tone={dnaScore > 80 ? 'gold' : 'slate'} />
        </div>
      </section>

      {/* Recent Investor Insights */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Recent Investor Insights</h2>
        <div className="bg-[#18181B] border border-slate-800/60 rounded-xl p-6">
          <div className="flex flex-col text-center justify-center py-4">
             <Video size={32} className="text-slate-600 mx-auto mb-3" />
             <p className="text-slate-400 text-sm">No recent insights from meetings recorded.</p>
             <div className="mt-4">
               <button onClick={() => navigate('/dashboard/outreach')} className="text-indigo-400 text-sm hover:text-indigo-300">Set up an intro meeting in Tracker →</button>
             </div>
          </div>
        </div>
      </section>

      {/* Projects & DNA */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">My Projects</h2>
            <button onClick={() => navigate('/dashboard/documents')} className="text-sm font-medium text-indigo-400 hover:text-indigo-300">View All</button>
          </div>
          <div className="bg-[#18181B] border border-slate-800/60 rounded-xl overflow-hidden divide-y divide-slate-800/50">
            {recentDocuments.length === 0 ? (
               <div className="p-6 text-center text-sm text-slate-500">
                 No documents created yet. <button onClick={openNewDoc} className="text-indigo-400 inline">Create one now.</button>
               </div>
            ) : recentDocuments.map(doc => (
              <ProjectRow 
                key={doc.id} 
                name={(doc as any).name || doc.title || 'Untitled'} 
                type={(doc as any).metadata?.document_type?.replace(/_/g, ' ') || doc.type?.replace(/_/g, ' ') || 'Document'} 
                sector={dna.identity?.name || 'Company'}
                time={((doc as any).updated_at || (doc as any).createdAt) ? formatDistanceToNow(((doc as any).updated_at?.toDate ? (doc as any).updated_at.toDate() : (doc as any).updated_at) || ((doc as any).createdAt?.toDate ? (doc as any).createdAt.toDate() : (doc as any).createdAt), { addSuffix: true }) : 'Recently'} 
                status="Active" 
                onClick={() => navigate(`/dashboard/documents/${doc.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Company DNA */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Company DNA</h2>
          <div className="bg-[#18181B] border border-slate-800/60 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                <Compass size={20} />
              </div>
              <button onClick={() => navigate('/dashboard/dna')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded text-xs font-medium transition-colors">
                Edit
              </button>
            </div>
            <h3 className="text-xl font-serif text-slate-100 mb-1">{dna.identity?.name || 'Company Name'}</h3>
            <p className="text-sm text-slate-400 mb-8">{dna.fundraising?.stage || 'Stage'} • {dna.identity?.hq || 'Location'}</p>
            
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-slate-400">Profile Completeness</span>
                <span className="text-sm font-semibold text-emerald-400">{dnaScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${dnaScore}%` }}></div>
              </div>
            </div>

            {dnaScore < 100 && (
              <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-amber-500 shrink-0">!</span>
                <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                  Missing crucial DNA information. Competing this improves your document quality and investor matches.
                </p>
              </div>
            )}
          </div>
        </div>

      </section>

    </div>
  );
};

const MetricCard = ({ label, value, trend, tone }: { label: string, value: string, trend: string, tone: 'emerald' | 'gold' | 'slate' }) => {
  return (
    <div className="bg-[#09090B] border border-slate-800/50 p-5 rounded-xl flex flex-col justify-center min-h-[110px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-serif text-slate-100">{value}</span>
        <span className={`text-xs ml-1 ${tone === 'gold' ? 'text-amber-400' : tone === 'emerald' ? 'text-emerald-400' : 'text-slate-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

const ProjectRow = ({ name, type, sector, time, status, onClick }: { name: string, type: string, sector: string, time: string, status: string, onClick?: () => void }) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Review': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Draft': return 'bg-slate-800 text-slate-400 border-slate-700 opacity-60';
      case 'Complete': return 'bg-slate-800 text-slate-300 border-slate-700';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div onClick={onClick} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
          <FileText size={18} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 capitalize">{name}</h4>
          <p className="text-xs text-slate-500 mt-0.5 capitalize">{type} • {sector} • {time}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-[10px] px-2 py-1 rounded-md border font-semibold tracking-wide ${getStatusColor(status)}`}>
          {status}
        </span>
        <div className="flex gap-2 text-slate-500">
          <button className="p-1 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
          <button className="p-1 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
        </div>
      </div>
    </div>
  );
};
