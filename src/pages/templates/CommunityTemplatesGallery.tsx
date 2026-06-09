import React, { useEffect, useState } from 'react';
import { LayoutTemplate, Sparkles, FolderLock, FileText, Share2, Layers, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { track } from '../../lib/analytics';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppStore } from '../../store/appStore';
import type { TemplateDoc } from '../../store';
import { createWorkspaceFromTemplate, inferRenderMode } from '../../lib/documents';

import toast from 'react-hot-toast';

export default function CommunityTemplatesGallery() {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  
  const [communityTemplates, setCommunityTemplates] = useState<TemplateDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchCommunityTemplates = async () => {
      try {
        const q = query(collection(db, "templates"), where("is_community", "==", true));
        const snap = await getDocs(q);
        setCommunityTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as TemplateDoc)));
      } catch (err) {
        console.error("Failed to load community templates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityTemplates();
  }, []);

  const handleUseTemplate = async (template: TemplateDoc) => {
    if (!user) {
      navigate('/auth?mode=signup&template=' + template.id);
      return;
    }
    
    setIsCreating(true);
    try {
      const mode = inferRenderMode(template);
      const res = await createWorkspaceFromTemplate({
        userId: user.uid,
        template,
        mode,
      });
      navigate(res.route);
    } catch (err: any) {
      console.error("Failed to create doc", err);
      toast.error(err.message || "Failed to create document from template");
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white overflow-y-auto">
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
            <span className="font-serif font-bold text-white leading-none">I</span>
          </div>
          <span className="font-sans font-semibold text-white tracking-tight">IdealApp</span>
        </div>
        <div className="flex gap-4">
           {!user ? (
             <>
               <button onClick={() => navigate('/auth?mode=signin')} className="text-sm font-medium hover:text-electric-violet transition-colors">Sign In</button>
               <button onClick={() => navigate('/auth?mode=signup')} className="text-sm font-medium px-4 py-1.5 bg-white text-obsidian rounded-full hover:bg-gray-200 transition-colors">Get Started</button>
             </>
           ) : (
             <button onClick={() => navigate('/dashboard')} className="text-sm font-medium px-4 py-1.5 bg-white text-obsidian rounded-full hover:bg-gray-200 transition-colors">Go to Dashboard</button>
           )}
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="mb-4 text-xs font-semibold tracking-[0.35em] text-electric-violet uppercase">Founder-Built Resources</div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Community Templates</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Start your next round with proven, battle-tested documents. 
            Anonymised and shared by successful founders on IdealApp.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : communityTemplates.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No community templates found.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {communityTemplates.map(tpl => (
              <div key={tpl.id} className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col hover:border-white/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/50 group-hover:text-electric-violet group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{tpl.name}</h3>
                <div className="flex gap-2 mb-6 text-xs font-medium">
                  {tpl.sector_tags?.slice(0, 1).map((s: string) => (
                     <span key={s} className="px-2 py-1 rounded bg-white/5 text-slate-300">{s}</span>
                  ))}
                  {tpl.category && <span className="px-2 py-1 rounded bg-white/5 text-slate-300">{tpl.category}</span>}
                </div>
                <p className="text-sm text-slate-400 mb-8 flex-1">
                  Start drafting using this community-sourced layout.
                </p>
                
                <button 
                  onClick={() => handleUseTemplate(tpl)}
                  disabled={isCreating}
                  className="w-full py-3 rounded-xl bg-electric-violet/10 text-electric-violet font-semibold border border-electric-violet/20 hover:bg-electric-violet hover:text-white transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Use this template in IdealApp →'}
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-20 p-8 md:p-12 glass-panel rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-space-indigo/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-xl">
             <h2 className="text-2xl font-serif mb-4">Want to share your success?</h2>
             <p className="text-slate-400">
               Pro users can anonymise their winning pitch decks, memos, and trackers with one click to help the next generation of founders.
             </p>
          </div>
          <button onClick={() => navigate('/auth?mode=signup')} className="relative z-10 px-8 py-3 bg-white text-obsidian font-bold rounded-full hover:scale-105 transition-transform flex-shrink-0">
             Try IdealApp Pro
          </button>
        </div>
      </main>
    </div>
  );
}
