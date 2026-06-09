import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Zap, 
  Shield, 
  Users,
  Search,
  Star,
  Check,
  MousePointer2,
  Layout,
  BarChart3,
  Clock,
  ChevronRight,
  MoreVertical,
  Trash2,
  UserCheck,
  DollarSign,
  Briefcase,
  Building2,
  Lightbulb,
  Gift,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../ui/Logo';
import { useAppStore } from '@/src/lib/store';
import { cn, formatDate } from '@/src/lib/utils';

import { useTemplates } from '../../hooks/useTemplates';

export const LandingPage: React.FC = () => {
  const { user: currentUser, guestCredits, setGuestCredits } = useAppStore();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Templates');
  const [promptValue, setPromptValue] = useState('');
  const { templates } = useTemplates();

  const handlePromptSubmit = async () => {
    if (!promptValue.trim()) return;
    // In a real app, we would call generateFromPrompt here
    // For now, we'll just navigate to the editor with the prompt as a query param
    navigate(`/editor/new?prompt=${encodeURIComponent(promptValue)}`);
  };

  // Handle daily credit reset logic
  useEffect(() => {
    const lastReset = localStorage.getItem('last_credit_reset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      localStorage.setItem('last_credit_reset', today);
      localStorage.setItem('guest_credits', '5');
      setGuestCredits(5);
    } else {
      const saved = localStorage.getItem('guest_credits');
      if (saved) setGuestCredits(parseInt(saved));
    }
  }, [setGuestCredits]);

  const collections = [
    { title: 'Investor Ready Pack', desc: 'Complete fundraising toolkit with pitch deck, financial model, and one-pager.', items: '12 templates', tag: 'Popular', icon: Building2, color: 'blue' },
    { title: 'Startup Kit', desc: 'Everything you need to launch your startup from idea to execution.', items: '18 templates', tag: 'New', icon: Zap, color: 'emerald' },
    { title: 'Marketing Bundle', desc: 'Comprehensive marketing templates for strategy, campaigns, and analysis.', items: '15 templates', tag: 'Pro', icon: Layout, color: 'purple' },
  ];

  const categories = [
    { id: 'all', label: 'All Templates', icon: FileText },
    { id: 'pitch-decks', label: 'Pitch Decks', icon: Zap },
    { id: 'business-plans', label: 'Business Plans', icon: Briefcase },
    { id: 'marketing', label: 'Marketing', icon: Layout },
    { id: 'legal', label: 'Legal', icon: Shield },
    { id: 'financial', label: 'Financial', icon: BarChart3 },
    { id: 'hr', label: 'HR', icon: Users },
    { id: 'operations', label: 'Operations', icon: Building2 },
  ];

  return (
    <div className="w-full h-full bg-[#f8fafc] md:bg-white pb-24">
      {/* Search Header for Dashboard */}
      <div className="bg-white py-6 px-6 md:px-12 sticky top-0 z-20 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search templates..."
              className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sort
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-6">
        
        {/* Categories Tab */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.label || (activeCategory === 'All Templates' && cat.id === 'all');
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === 'all' ? 'All Templates' : cat.label)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                  isActive 
                    ? "bg-white text-indigo-600 border-indigo-200 shadow-sm ring-1 ring-indigo-100" 
                    : "bg-transparent text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center gap-4 mb-8">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-700">1-{Math.min(12, templates.length || 50)}</span> of <span className="font-bold text-slate-700">{Math.max(templates.length, 50)}+</span> Templates
          </p>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-4" />
              <p className="text-zinc-500 font-medium">Loading templates...</p>
            </div>
          ) : templates.map((tpl, i) => (
            <div 
              key={i}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Image Area */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-100 shadow-sm">
                  <Zap size={12} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-700 tracking-wider uppercase">PITCH-DECK</span>
                </div>
                
                {/* Center Icon Graphic */}
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {tpl.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {tpl.description || 'Professional investor presentation template tailored for startups.'}
                </p>
                
                {/* Meta Footer */}
                <div className="flex items-center justify-between mt-auto mb-6">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FileText size={14} />
                    <span className="text-xs font-medium">{tpl.sections?.length || 15} pages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} fill="currentColor" size={12} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-600 ml-1">4.9</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Preview
                  </button>
                  <button 
                    onClick={async () => {
                      const { createProject } = await import('../../services/projectService');
                      const { useAuthStore } = await import('../../store/authStore');
                      const uid = useAuthStore.getState().user?.uid;
                      if (!uid) return;
                      const newId = await createProject(uid, {
                        title: tpl.title + ' Copy',
                        sections: tpl.sections && tpl.sections.length > 0 ? tpl.sections.map(s => ({ heading: s.heading || 'Section', content: s.body || s.content || '' })) : [
                          { heading: 'Cover', content: tpl.title },
                          { heading: 'Summary', content: 'Describe your vision here.' }
                        ],
                        canvasData: '',
                        status: 'draft',
                        isInDataRoom: false,
                        thumbnail: '',
                        tags: ['template'],
                        workspaceId: null,
                        templateId: tpl.id || tpl.title,
                      });
                      window.location.href = `/editor/${newId}`;
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white font-semibold text-sm hover:bg-slate-800 transition-all"
                  >
                    Use <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
