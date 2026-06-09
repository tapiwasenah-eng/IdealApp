import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Clock, Search, MoreVertical, LayoutGrid, List, Sparkles, LayoutDashboard, FolderLock, Users, Target, LayoutTemplate, BarChart3, Dna, Settings } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAppStore } from '../store/appStore';
import { useStartInvestorDocFlow } from '../hooks/useStartInvestorDocFlow';
import { createEmptyDocument } from '../lib/documents';

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: FileText, label: 'Documents', path: '/dashboard/documents', active: true },
  { icon: FolderLock, label: 'Data Room', path: '/data-room' },
  { icon: Users, label: 'Investor Match', path: '/investors', badge: 'Pro' },
  { icon: Target, label: 'Outreach Tracker', path: '/outreach', badge: 'Pro' },
  { icon: LayoutTemplate, label: 'Templates', path: '/templates' },
  { icon: BarChart3, label: 'Analytics', path: '#' },
  { icon: Dna, label: 'Company DNA', path: '#' },
  { icon: Settings, label: 'Settings', path: '#' },
];

export default function DocumentsSpacePage() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.user);
  const { start } = useStartInvestorDocFlow();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "users", user.uid, "documents"),
      orderBy("updated_at", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setDocs(rows);
        setLoading(false);
      },
      (err) => {
        console.error("Docs snapshot error", err);
        setError("Unable to load documents.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user?.uid]);

  const handleNewDocument = async () => {
    if (!user) {
      navigate('/signup?redirect=/dashboard/documents');
      return;
    }
    const docId = await createEmptyDocument(user.uid, 'Untitled Document', 'pitch_deck');
    navigate(`/dashboard/documents/${docId}`);
  };

  const activeCount = docs.filter(d => d.status === 'active').length;
  const reviewCount = docs.filter(d => d.status === 'in_review').length;
  const draftCount = docs.filter(d => d.status === 'draft').length;

  return (
    <div className="flex bg-obsidian min-h-screen text-cosmic-white overflow-hidden bg-grain">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-obsidian border-r border-white/10 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
              <span className="font-serif font-bold text-white leading-none">I</span>
            </div>
            <span className="font-sans font-semibold text-white tracking-tight">IdealApp</span>
          </div>
        </div>
        
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem-80px)]">
          {SIDEBAR_ITEMS.map((item, idx) => (
            <button key={idx} onClick={() => navigate(item.path)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${item.active ? 'bg-white/10 text-white font-medium' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}>
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-electric-violet/20 text-electric-violet uppercase tracking-wider">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-obsidian">
           <button className="w-full flex items-center justify-center gap-2 glass-button py-2.5 rounded-xl font-medium text-sm">
             <Sparkles className="w-4 h-4 text-investor-gold" />
             Upgrade to Pro
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 h-screen overflow-y-auto">
        {/* Mobile Header logic here or assumed wrapped */}
        <div className="lg:hidden sticky top-0 h-16 glass-panel border-b border-white/10 z-30 flex items-center justify-between px-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-white/70 hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16M4 6h16M4 18h16"/></svg>
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
            <span className="font-serif font-bold text-white leading-none">I</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10"></div>
        </div>
        
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 pb-32">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif flex items-center gap-3">
                Documents
              </h1>
              <p className="text-slate-400 mt-1 text-sm">Manage your pitch decks, memos, and financial models.</p>
            </div>
            <button 
              onClick={handleNewDocument}
              className="bg-white text-[#0A0D14] px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shrink-0 shadow-lg"
            >
              <Plus className="w-4 h-4" /> New Document
            </button>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-xs text-slate-400 mb-2 font-medium bg-white/5 inline-block px-2 py-0.5 rounded-md">Total Created</div>
                <div className="text-3xl font-serif font-bold text-white">{docs.length}</div>
             </div>
             <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-xs text-slate-400 mb-2 font-medium bg-plasma-green/10 text-plasma-green inline-block px-2 py-0.5 rounded-md">Active</div>
                <div className="text-3xl font-serif font-bold text-white">{activeCount}</div>
             </div>
             <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-xs text-slate-400 mb-2 font-medium bg-trust-blue/10 text-trust-blue inline-block px-2 py-0.5 rounded-md">In Review</div>
                <div className="text-3xl font-serif font-bold text-white">{reviewCount}</div>
             </div>
             <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-xs text-slate-400 mb-2 font-medium bg-white/5 inline-block px-2 py-0.5 rounded-md">Drafts</div>
                <div className="text-3xl font-serif font-bold text-white">{draftCount}</div>
             </div>
          </div>

          {/* Document List */}
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">All Documents</h3>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-[#151A26] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric-violet" />
                   </div>
                   <div className="flex gap-1 bg-[#151A26] border border-white/10 rounded-lg p-1">
                      <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><List className="w-4 h-4" /></button>
                      <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><LayoutGrid className="w-4 h-4" /></button>
                   </div>
                </div>
             </div>

             {loading ? (
                <div className="text-center py-20 text-slate-400 text-sm">Loading documents...</div>
             ) : error ? (
                <div className="text-center py-20 text-crimson-alert text-sm">{error}</div>
             ) : docs.length === 0 ? (
                <div className="glass-panel border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
                      <FileText className="w-8 h-8 text-electric-violet" />
                   </div>
                   <h2 className="text-2xl font-serif text-white mb-3">No documents yet</h2>
                   <p className="text-slate-400 mb-8 max-w-sm mx-auto">Start your fundraising journey by getting your core materials ready.</p>
                   <button 
                     onClick={handleNewDocument}
                     className="px-6 py-3 bg-white text-[#0A0D14] rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl"
                   >
                     Create your first investor-ready doc
                   </button>
                </div>
             ) : (
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                   {docs.map((doc, i) => {
                      const updatedDate = doc.updated_at?.toDate ? doc.updated_at.toDate().toLocaleDateString() : 'Just now';
                      return (
                      <div key={doc.id} onClick={() => navigate(`/dashboard/documents/${doc.id}`)} className="flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 transition-colors cursor-pointer last:border-0 group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-space-indigo/20 flex items-center justify-center border border-space-indigo/30 text-electric-violet shrink-0 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-white/90 text-sm sm:text-base">{doc.name}</div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                              <span>{doc.document_type || 'Document'}</span>
                              {doc.sector && <><span>•</span><span>{doc.sector}</span></>}
                              {doc.stage && <><span>•</span><span>{doc.stage}</span></>}
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {updatedDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`hidden sm:inline-flex text-xs px-2 py-1 rounded-full border ${
                            doc.status === 'active' ? 'bg-plasma-green/10 border-plasma-green/20 text-plasma-green' : 
                            doc.status === 'in_review' ? 'bg-trust-blue/10 border-trust-blue/20 text-trust-blue' :
                            'bg-white/5 border-white/10 text-white/50'
                          }`}>
                            {doc.status || 'Draft'}
                          </span>
                          <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors" onClick={(e) => { e.stopPropagation(); }}><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </div>
                      );
                   })}
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
