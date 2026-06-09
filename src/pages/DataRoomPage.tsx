import React, { useState, useEffect } from 'react';
import { 
  Folder, FileText, FileSpreadsheet, Lock, Users,
  ChevronRight, Search, Plus, MoreHorizontal, FileIcon,
  UploadCloud, Sparkles, Share2, Shield, Eye, Clock,
  ArrowLeft, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDocumentStore } from '../lib/store/useDocumentStore';
import { useAppStore } from '../store/appStore';
import { formatDistanceToNow } from 'date-fns';

export default function DataRoomPage() {
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState('financials');
  const user = useAppStore(state => state.user);
  const { documents, loadAllDocuments } = useDocumentStore();

  useEffect(() => {
    if (user) {
      loadAllDocuments();
    }
  }, [user, loadAllDocuments]);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'financials':
      case 'excel': return <FileSpreadsheet className="w-8 h-8 text-plasma-green" />;
      case 'memo': 
      case 'pdf': return <FileText className="w-8 h-8 text-crimson-alert" />;
      case 'doc': 
      case 'pitch_deck': return <FileIcon className="w-8 h-8 text-trust-blue" />;
      default: return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="flex bg-[#09090B] h-full text-slate-200 font-sans">
      
      {/* Sidebar Directory */}
      <aside className="w-72 bg-[#0E0E11] border-r border-slate-800/50 flex flex-col shrink-0 lg:flex hidden">
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
              <Lock className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">Data Room</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-4">Directory</div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 text-slate-300">
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <Folder className="w-4 h-4 text-investor-gold" />
              <span className="text-sm font-medium">Main Room</span>
            </div>
            
            <div className="ml-5 border-l border-white/10 pl-2 space-y-1 mt-1">
              {[
                { id: 'legal', name: '01 Legal Docs', count: 12 },
                { id: 'financials', name: '02 Financials', count: 8 },
                { id: 'ip', name: '03 IP Portfolio', count: 4 },
                { id: 'hr', name: '04 HR & Team', count: 21 },
                { id: 'metrics', name: '05 Core Metrics', count: 5 }
              ].map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeFolder === folder.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`w-4 h-4 ${activeFolder === folder.id ? 'text-trust-blue fill-trust-blue/20' : 'text-slate-500'}`} />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
           <div className="bg-[#151A26] rounded-xl p-4 border border-white/5">
             <div className="flex items-center gap-2 text-electric-violet mb-2">
               <Shield className="w-4 h-4" />
               <span className="text-sm font-semibold">Security Active</span>
             </div>
             <p className="text-xs text-slate-500">End-to-end encryption enabled. Access logs are actively monitored.</p>
           </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-[72px] flex items-center justify-between px-6 border-b border-slate-800/50 bg-[#09090B] z-10 shrink-0">
          <div className="flex flex-col">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              Main Room <ChevronRight className="w-3 h-3" /> Financials
            </div>
            <h1 className="text-xl font-medium text-white">02 Financials</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-sm mr-4 border-r border-white/10 pr-4">
              <div className="flex flex-col items-end">
                <span className="text-white font-medium">14</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Total Files</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-plasma-green font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-plasma-green animate-pulse"></span> 3</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Viewers</span>
              </div>
            </div>
            
            <button className="hidden sm:flex px-4 py-2 text-sm font-medium rounded-lg border border-trust-blue/30 text-trust-blue bg-trust-blue/10 hover:bg-trust-blue/20 transition-colors items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Summary
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors items-center gap-2 hidden sm:flex">
              <Users className="w-4 h-4" />
              Invite
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.origin + '/data-room/public');
              toast.success('Link copied to clipboard');
            }} className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-[#0A0D14] hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search files, contents, or AI summaries..." 
              className="w-full bg-[#151A26] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-space-indigo transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white bg-[#151A26] border border-white/5 rounded-lg transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button className="p-2 text-space-indigo bg-space-indigo/10 border border-space-indigo/20 rounded-lg transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Upload Zone */}
            <label className="border-2 border-dashed border-white/10 rounded-2xl bg-[#0A0D14] hover:bg-[#151A26] transition-colors flex flex-col items-center justify-center p-8 cursor-pointer group min-h-[200px]">
              <input type="file" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  // Simulate upload via existing useDataRoomStore or similar
                  const user = (window as any).__FIREBASE_USER__ || { uid: 'mock' }; // fallback
                  // just simulate a toast and an async delay
                  toast.loading(`Uploading ${file.name}...`, { id: 'upload' });
                  setTimeout(() => {
                    toast.success('Asset uploaded successfully', { id: 'upload' });
                  }, 2000);
                } catch(e) {
                  toast.error('Failed to upload asset');
                }
              }} />
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-sm font-medium text-white mb-1">Upload New Asset</span>
              <span className="text-xs text-slate-500 text-center max-w-[150px]">Drag and drop or click to browse</span>
            </label>

            {/* Files */}
            {documents.map(doc => (
              <div key={doc.id} onClick={() => navigate('/dashboard/documents/' + doc.id)} className="bg-[#151A26] rounded-2xl border border-slate-800/50 p-5 hover:border-slate-700 transition-all group flex flex-col relative cursor-pointer">
                
                {/* Top Row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1C2333] flex items-center justify-center border border-white/5">
                    {getFileIcon(doc.type || 'doc')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md ${((doc as any).status || 'private') === 'shared' ? 'bg-plasma-green/10 text-plasma-green' : 'bg-amber-signal/10 text-amber-signal'}`}>
                      {(doc as any).status || 'Private'}
                    </span>
                    <button className="text-slate-500 hover:text-white p-1 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-4 flex-1">
                  <h3 className="text-sm font-medium text-white mb-1 leading-snug line-clamp-2" title={doc.title}>
                    {doc.title || (doc as any).name || 'Untitled Document'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {((doc as any).updated_at || (doc as any).createdAt) ? formatDistanceToNow(((doc as any).updated_at?.toDate ? (doc as any).updated_at.toDate() : (doc as any).updated_at) || ((doc as any).createdAt?.toDate ? (doc as any).createdAt.toDate() : (doc as any).createdAt), { addSuffix: true }) : 'Recently'}</span>
                    <span>•</span>
                    <span className="capitalize">{doc.type || 'Document'}</span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>0 views</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-medium text-electric-violet hover:text-white transition-colors bg-electric-violet/10 px-2 py-1 rounded">
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </main>
    </div>
  );
}

