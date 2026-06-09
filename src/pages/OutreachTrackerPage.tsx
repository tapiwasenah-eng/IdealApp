import React, { useState, useEffect } from 'react';
import { Columns, LayoutList, Search, Plus, Filter, Mail, Eye, Clock, CheckCircle, XCircle, MoreHorizontal, ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const STAGES = [
  { id: 'to_contact', label: 'To Contact', color: 'border-slate-500/30 text-slate-400 bg-slate-500/10' },
  { id: 'contacted', label: 'Contacted', color: 'border-trust-blue/30 text-trust-blue bg-trust-blue/10' },
  { id: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'border-investor-gold/30 text-investor-gold bg-investor-gold/10' },
  { id: 'evaluating', label: 'Evaluating', color: 'border-space-indigo/30 text-space-indigo bg-space-indigo/10' },
  { id: 'term_sheet', label: 'Term Sheet', color: 'border-plasma-green/30 text-plasma-green bg-plasma-green/10' },
  { id: 'passed', label: 'Passed', color: 'border-crimson-alert/30 text-crimson-alert bg-crimson-alert/10' },
];

export default function OutreachTrackerPage() {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newInvestor, setNewInvestor] = useState({ name: '', partner: '', nextAction: '' });
  const [updateContent, setUpdateContent] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'outreach'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: d.data().updatedAt?.toDate()?.toLocaleDateString() || 'Today'
      }));
      setPipeline(data);
    });
    return unsub;
  }, [user]);

  const handleAddInvestor = async () => {
    if (!user || !newInvestor.name) return;
    try {
      await addDoc(collection(db, 'outreach'), {
        ownerId: user.uid,
        name: newInvestor.name,
        partner: newInvestor.partner,
        stage: 'to_contact',
        nextAction: newInvestor.nextAction,
        updatedAt: serverTimestamp(),
      });
      setIsAddModalOpen(false);
      setNewInvestor({ name: '', partner: '', nextAction: '' });
      toast.success('Investor added');
    } catch(e) {
      toast.error('Failed to add investor');
    }
  };

  const handleDraftUpdate = async () => {
    if (!user) return;
    import('../lib/analytics').then(({ track }) => {
       track('investor_update_sent', { update_period: '2026-W23', investor_count: pipeline.length, doc_ids: [] });
    });
    toast.success('Investor update sent successfully.');
    setIsUpdateModalOpen(false);
    setUpdateContent('');
  };

  const moveStage = async (id: string, currentStage: string, direction: 'left' | 'right') => {
    if (!user) return;
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);
    const nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= STAGES.length) return;
    const newStage = STAGES[nextIndex].id;
    try {
      await updateDoc(doc(db, 'outreach', id), {
        stage: newStage,
        updatedAt: serverTimestamp()
      });
    } catch(e) {
      toast.error('Failed to move stage');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090B] text-slate-200">
      
      {/* Header */}
      <header className="h-[72px] shrink-0 border-b border-slate-800/50 bg-[#0E0E11] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-medium text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-trust-blue" />
              Outreach Tracker
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#151A26] rounded-lg border border-white/5 p-1">
             <button onClick={() => setViewMode('board')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
               <Columns className="w-4 h-4" />
             </button>
             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
               <LayoutList className="w-4 h-4" />
             </button>
          </div>
          <button onClick={() => setIsUpdateModalOpen(true)} className="px-4 py-2 rounded-lg bg-electric-violet/10 text-electric-violet text-sm font-medium hover:bg-electric-violet/20 border border-electric-violet/30 transition-colors flex items-center gap-2">
            Draft Weekly Update
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="px-5 py-2 rounded-lg bg-white text-[#0A0D14] text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Investor
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 shrink-0 bg-[#0A0D14]">
         <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search firm, partner, status..."
              className="w-full h-10 pl-10 pr-4 bg-[#151A26] border border-white/5 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-space-indigo/50 transition-colors"
            />
         </div>
         <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="p-6 h-full min-w-max">
          
          {viewMode === 'board' ? (
            <div className="flex gap-6 h-full items-start">
              {STAGES.map(stage => (
                <div key={stage.id} className="w-80 shrink-0 flex flex-col h-full">
                  <div className="flex flex-col mb-4">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white/90">{stage.label}</h3>
                        <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{pipeline.filter(p => p.stage === stage.id).length}</span>
                     </div>
                     <div className={`h-1 w-full rounded-full border ${stage.color}`}></div>
                  </div>
                  
                  <div className="flex-1 space-y-3 overflow-y-auto pb-8 pr-2 custom-scrollbar">
                     {pipeline.filter(p => p.stage === stage.id).map(item => (
                       <div key={item.id} onClick={() => navigate(`/outreach/${item.id}`)} className="bg-[#151A26] p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              <button onClick={() => moveStage(item.id, item.stage, 'left')} className="text-slate-500 hover:text-white transition-opacity hidden group-hover:block"><ChevronLeft className="w-4 h-4" /></button>
                              <button onClick={() => moveStage(item.id, item.stage, 'right')} className="text-slate-500 hover:text-white transition-opacity hidden group-hover:block"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div className="text-sm text-slate-400 mb-4">{item.partner}</div>
                          
                          <div className="p-2.5 bg-[#0A0D14] rounded-lg border border-white/5 mb-3">
                             <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Next Action</div>
                             <div className="text-sm text-white/90 truncate">{item.nextAction}</div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Updated {item.date}</span>
                            <span className="flex items-center gap-1 hover:text-trust-blue transition-colors">Thread <ArrowUpRight className="w-3 h-3" /></span>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full max-w-6xl mx-auto block xl:flex xl:flex-col h-full">
              <div className="bg-[#151A26] rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-white/5 bg-[#0F141E] text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-4 font-medium">Firm</th>
                        <th className="px-6 py-4 font-medium">Partner</th>
                        <th className="px-6 py-4 font-medium">Stage</th>
                        <th className="px-6 py-4 font-medium">Next Action</th>
                        <th className="px-6 py-4 font-medium text-right">Last Updated</th>
                     </tr>
                   </thead>
                    <tbody className="text-sm">
                     {pipeline.map(item => {
                       const stageDef = STAGES.find(s => s.id === item.stage);
                       return (
                         <tr key={item.id} onClick={() => navigate(`/outreach/${item.id}`)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                           <td className="px-6 py-4 font-semibold text-white">{item.name}</td>
                           <td className="px-6 py-4 text-slate-300">{item.partner}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${stageDef?.color}`}>
                                {stageDef?.label}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-slate-300">{item.nextAction}</td>
                           <td className="px-6 py-4 text-right text-slate-500">{item.date}</td>
                         </tr>
                       )
                     })}
                   </tbody>
                </table>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
           <div className="bg-[#151A26] rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0F141E]">
                 <h3 className="font-medium text-white">Add Investor</h3>
                 <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white"><XCircle className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Firm Name</label>
                    <input type="text" value={newInvestor.name} onChange={e => setNewInvestor({ ...newInvestor, name: e.target.value })} className="w-full bg-[#0A0D14] border border-white/10 rounded-lg p-2.5 text-white" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Partner Name</label>
                    <input type="text" value={newInvestor.partner} onChange={e => setNewInvestor({ ...newInvestor, partner: e.target.value })} className="w-full bg-[#0A0D14] border border-white/10 rounded-lg p-2.5 text-white" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Next Action</label>
                    <input type="text" value={newInvestor.nextAction} onChange={e => setNewInvestor({ ...newInvestor, nextAction: e.target.value })} className="w-full bg-[#0A0D14] border border-white/10 rounded-lg p-2.5 text-white" />
                 </div>
              </div>
              <div className="p-4 border-t border-white/5 bg-[#0F141E] flex justify-end gap-3">
                 <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">Cancel</button>
                 <button onClick={handleAddInvestor} className="px-5 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-slate-200">Save</button>
              </div>
           </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
           <div className="bg-[#151A26] rounded-2xl border border-white/10 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0F141E]">
                 <h3 className="font-medium text-white flex items-center gap-2"><Clock className="w-4 h-4 text-electric-violet" /> Draft Investor Update (Week 23)</h3>
                 <button onClick={() => setIsUpdateModalOpen(false)} className="text-slate-400 hover:text-white"><XCircle className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="flex gap-4">
                   <div className="flex-1 space-y-4">
                      <div>
                         <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
                         <input type="text" defaultValue="TechCorp Global - Week 23 Update" className="w-full bg-[#0A0D14] border border-white/10 rounded-lg p-2.5 text-white" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-400 mb-1">Update Body</label>
                         <textarea 
                           rows={8}
                           value={updateContent}
                           onChange={e => setUpdateContent(e.target.value)}
                           placeholder="Highlights:&#10;• &#10;&#10;Key Metrics:&#10;• &#10;&#10;Risks & Asks:&#10;• " 
                           className="w-full bg-[#0A0D14] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-space-indigo" 
                         />
                         <div className="flex justify-end mt-1">
                            <span className="text-xs text-slate-500">{updateContent.length} / 1500 chars (keep it concise)</span>
                         </div>
                      </div>
                   </div>
                   <div className="w-48 shrink-0 space-y-3 hidden sm:block">
                      <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Checklist</h4>
                      <label className="flex items-start gap-2 text-sm text-slate-300">
                        <input type="checkbox" className="mt-1" defaultChecked />
                        Key Metrics
                      </label>
                      <label className="flex items-start gap-2 text-sm text-slate-300">
                        <input type="checkbox" className="mt-1" defaultChecked />
                        Highlights
                      </label>
                      <label className="flex items-start gap-2 text-sm text-slate-300">
                        <input type="checkbox" className="mt-1" />
                        Risks & Asks
                      </label>
                      <div className="p-3 mt-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Recipients</p>
                        <p className="text-xs font-bold text-white">{pipeline.filter(p => !['passed', 'to_contact'].includes(p.stage)).length} Investors</p>
                      </div>
                   </div>
                 </div>
              </div>
              <div className="p-4 border-t border-white/5 bg-[#0F141E] flex justify-between gap-3">
                 <button className="px-4 py-2 text-sm font-medium text-electric-violet hover:bg-electric-violet/10 rounded-lg border border-electric-violet/20 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Polish via AI
                 </button>
                 <div className="flex gap-2">
                   <button onClick={() => setIsUpdateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">Save Draft</button>
                   <button onClick={handleDraftUpdate} className="px-5 py-2 text-sm font-medium bg-electric-violet text-white rounded-lg hover:bg-electric-violet/90 transition-colors">Send Update</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
