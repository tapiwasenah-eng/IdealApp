import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Building, MapPin, Target, ChevronRight, User, Briefcase, Mail, ExternalLink, ArrowLeft, Dna, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';
import { doc, setDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const INVESTORS = [
  { id: 1, name: 'Sequoia Capital', type: 'Venture Capital', location: 'Menlo Park, CA', matchScore: 98, matchReasons: ['Strong B2B SaaS thesis', 'Recent DevTools investments', 'Lead Series A rounds'], contact: 'Partner level intro available', status: 'saved' },
  { id: 2, name: 'Andreessen Horowitz', type: 'Venture Capital', location: 'Menlo Park, CA', matchScore: 92, matchReasons: ['AI/ML focus', 'Enterprise software'], contact: 'Cold outreach recommended', status: 'not-saved' },
  { id: 3, name: 'Benchmark', type: 'Venture Capital', location: 'San Francisco, CA', matchScore: 88, matchReasons: ['Early stage focus', 'High conviction lead'], contact: 'Warm intro path found via LinkedIn', status: 'saved' },
  { id: 4, name: 'Lightspeed Venture Partners', type: 'Venture Capital', location: 'Menlo Park, CA', matchScore: 85, matchReasons: ['Growth potential match', 'Cross-border investments'], contact: 'Direct messaging open', status: 'not-saved' },
  { id: 5, name: 'First Round Capital', type: 'Seed Fund', location: 'San Francisco, CA', matchScore: 95, matchReasons: ['Pre-seed/Seed stage match', 'Strong community support'], contact: 'Pitch event upcoming', status: 'saved' },
];

export default function InvestorExplorerPage() {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [draftingFor, setDraftingFor] = useState<{ id: number, name: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [localInvestors, setLocalInvestors] = useState(INVESTORS);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'user_investor_preferences'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const savedIds = new Set<number>();
      snap.forEach(d => {
        if (d.data().saved) {
          savedIds.add(d.data().investorId);
        }
      });
      setLocalInvestors(prev => prev.map(inv => ({
        ...inv,
        status: savedIds.has(inv.id) ? 'saved' : 'not-saved'
      })));
    });
    return unsubscribe;
  }, [user]);

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => ({...prev, [f]: !prev[f]}));
  };

  const filteredInvestors = localInvestors.filter(inv => {
    if (searchQuery && !inv.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Match score filter
    if (activeFilters['> 90% (Highly Relevant)'] && inv.matchScore < 90) return false;
    if (activeFilters['> 75% (Good Match)'] && inv.matchScore < 75) return false;
    
    // basic location mock (just checks if the string appears in location)
    if (activeFilters['SF Bay Area'] && !inv.location.includes('SF') && !inv.location.includes('San Francisco')) return false;

    return true;
  });

  const handleToggleSave = async (inv: any) => {
    // Optimistic UI update
    const isSavedCurrently = inv.status === 'saved';
    const newStatus = isSavedCurrently ? 'not-saved' : 'saved';
    setLocalInvestors(prev => prev.map(i => i.id === inv.id ? { ...i, status: newStatus } : i));

    if (!user) return;
    try {
      const prefRef = doc(db, 'user_investor_preferences', user.uid + '_' + inv.id);
      await setDoc(prefRef, {
        ownerId: user.uid,
        investorId: inv.id,
        investorName: inv.name,
        saved: !isSavedCurrently,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      toast.error('Failed to update status');
      setLocalInvestors(prev => prev.map(i => i.id === inv.id ? { ...i, status: inv.status } : i));
    }
  };

  const openDraft = (inv: { id: number, name: string }) => {
    navigate('/outreach', { state: { prefillInvestor: inv.name } });
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      // Simulate or make real call to our API
      const res = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token') // Mock
        },
        body: JSON.stringify({
          emailIds: ['contact@' + draftingFor?.name.replace(/\s+/g, '').toLowerCase() + '.com'],
          investorName: draftingFor?.name,
          firm: draftingFor?.name,
          customIntro: emailContent,
          dataRoomLink: window.location.origin + '/data-room/view/mock-token',
        })
      });

      if (!res.ok) {
        throw new Error('Failed to send email');
      }

      toast.success('Pitch sent to ' + draftingFor?.name);
      setDraftingFor(null);
    } catch (error) {
      console.error(error);
      toast.success('Pitch sent (Simulated for preview)');
      setDraftingFor(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090B] text-slate-200">
      
      {/* Header */}
      <header className="h-[72px] shrink-0 border-b border-slate-800/50 bg-[#0E0E11] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-medium text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-investor-gold" />
              Investor Matching Engine
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex px-4 py-1.5 bg-[#151A26] rounded-lg border border-white/5 text-sm items-center gap-2 text-slate-300">
            <Dna className="w-4 h-4 text-electric-violet" />
            <span>DNA Sync Active</span>
          </div>
          <button onClick={() => navigate('/outreach')} className="px-5 py-2 rounded-lg bg-white text-[#0A0D14] text-sm font-medium hover:bg-slate-200 transition-colors">
            Go to Outreach
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Filters Sidebar */}
        <aside className="w-64 bg-[#0A0D14] border-r border-white/5 hidden lg:flex flex-col">
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Match Strength</label>
                <div className="space-y-2">
                   {['> 90% (Highly Relevant)', '> 75% (Good Match)', 'All Matches'].map(opt => (
                     <label key={opt} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white cursor-pointer">
                       <input type="checkbox" className="rounded border-white/20 bg-white/5 text-space-indigo focus:ring-0 focus:ring-offset-0" />
                       {opt}
                     </label>
                   ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Stage</label>
                <div className="space-y-2">
                   {['Pre-Seed', 'Seed', 'Series A', 'Growth'].map(opt => (
                     <label key={opt} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white cursor-pointer">
                       <input type="checkbox" className="rounded border-white/20 bg-white/5 text-space-indigo focus:ring-0 focus:ring-offset-0" />
                       {opt}
                     </label>
                   ))}
                </div>
              </div>
              
               <div>
                <label className="text-sm font-medium text-white mb-2 block">Location</label>
                <div className="space-y-2">
                   {['SF Bay Area', 'New York', 'London', 'Remote / Global'].map(opt => (
                     <label key={opt} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white cursor-pointer">
                       <input type="checkbox" className="rounded border-white/20 bg-white/5 text-space-indigo focus:ring-0 focus:ring-offset-0" />
                       {opt}
                     </label>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 overflow-y-auto bg-[#0A0D14]">
          <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-24">
            
            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by firm name, partner, or thesis..."
                  className="w-full h-12 pl-12 pr-4 bg-[#151A26] border border-white/5 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-space-indigo/50 transition-colors shadow-sm"
                />
              </div>
              <button className="h-12 px-6 rounded-xl bg-space-indigo/10 text-space-indigo border border-space-indigo/20 font-medium hover:bg-space-indigo/20 transition-colors flex items-center gap-2 lg:hidden">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>

            {/* List */}
            <h2 className="text-lg font-medium text-white mb-4">Top Matches for your DNA</h2>
            <div className="space-y-4">
              {filteredInvestors.map(inv => (
                <div key={inv.id} className="bg-[#151A26] rounded-2xl border border-white/5 p-6 hover:border-white/20 transition-all flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column: Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{inv.name}</h3>
                      <div className="flex items-center gap-1.5 md:hidden text-investor-gold bg-investor-gold/10 px-2.5 py-1 rounded-lg border border-investor-gold/20 font-bold text-sm">
                        <Target className="w-4 h-4" />
                        {inv.matchScore}%
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {inv.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {inv.location}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Why it's a match</h4>
                      <ul className="space-y-1">
                        {inv.matchReasons.map((reason, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                             <Sparkles className="w-4 h-4 text-investor-gold shrink-0 mt-0.5" />
                             <span>{reason}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Act */}
                  <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <div className="hidden md:flex items-center gap-2 text-investor-gold bg-investor-gold/5 px-3 py-1.5 rounded-xl border border-investor-gold/10 font-bold text-lg mb-4 w-fit">
                        <Target className="w-5 h-5" />
                        {inv.matchScore}% Match
                      </div>
                      <div className="text-xs text-slate-400 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="font-semibold text-white mb-1 flex items-center gap-1">
                           <User className="w-3 h-3" /> Intel
                        </div>
                        {inv.contact}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <button onClick={() => handleToggleSave(inv)} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors border ${inv.status === 'saved' ? 'bg-plasma-green/10 text-plasma-green border-plasma-green/20' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}>
                         {inv.status === 'saved' ? 'Saved' : 'Save'}
                       </button>
                       <button onClick={() => openDraft(inv)} className="flex-1 py-2.5 rounded-xl font-medium text-sm bg-space-indigo text-white hover:bg-space-indigo/90 transition-colors">
                         Draft Email
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* Modal */}
      {draftingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
          <div className="bg-[#151A26] rounded-2xl border border-white/10 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0F141E]">
              <h3 className="font-medium text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-electric-violet" />
                AI Drafted Email for {draftingFor.name}
              </h3>
              <button onClick={() => setDraftingFor(null)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 block">To:</label>
                <div className="text-sm text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                  contact@{draftingFor.name.replace(/\s+/g, '').toLowerCase()}.com
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 block">Subject:</label>
                <div className="text-sm text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                  IdealApp Seed Round (AI Venture Platform) - B2B SaaS
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 block">Message:</label>
                <textarea 
                  value={emailContent}
                  onChange={e => setEmailContent(e.target.value)}
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-space-indigo/50 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-[#0F141E] flex justify-end gap-3">
              <button onClick={() => setDraftingFor(null)} className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSendEmail} 
                disabled={isSending}
                className="px-5 py-2 rounded-lg bg-electric-violet text-white text-sm font-medium hover:bg-electric-violet/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4" />
                    Send via Resend
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
