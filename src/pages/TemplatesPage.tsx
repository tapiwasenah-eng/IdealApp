// src/pages/TemplatesPage.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Filter, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { useStore } from '../store';
import type { TemplateDoc } from '../store';
import { createWorkspaceFromTemplate, inferRenderMode } from '../lib/services/documents';
import { track } from '../lib/analytics';
import AITemplateGenerator from '../components/templates/AITemplateGenerator';

interface TemplateCardProps {
  template: TemplateDoc;
  onUse: (template: TemplateDoc) => void;
  onOpen: (template: TemplateDoc) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onUse,
  onOpen,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between hover:border-indigo-500/60 hover:bg-slate-900/80 transition-colors">
      <div className="cursor-pointer" onClick={() => onOpen(template)}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-50 truncate">
            {template.name}
          </h3>
          {template.is_community && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/40">
              Founder-Built
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-3">
          {(template.document_type || 'pitch_deck').replace(/_/g, ' ')}
        </p>
        <div className="flex flex-wrap gap-1">
          {template.sector && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              {template.sector}
            </span>
          )}
          {template.stage && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              {template.stage}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onUse(template)}
          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Use template
        </button>
        <button
          type="button"
          onClick={() => onOpen(template)}
          className="text-[11px] text-slate-400 hover:text-slate-200"
        >
          Preview
        </button>
      </div>
    </div>
  );
};

type CategoryKey =
  | 'all'
  | 'saas'
  | 'deeptech'
  | 'fintech'
  | 'pitch_decks'
  | 'financial_models'
  | 'founder_built';

const categoryToFilter: Record<CategoryKey, (t: TemplateDoc) => boolean> = {
  all: () => true,
  saas: (t) => t.category === 'saas',
  deeptech: (t) => t.category === 'deeptech',
  fintech: (t) => t.category === 'fintech',
  pitch_decks: (t) => t.category === 'pitch_deck',
  financial_models: (t) => t.category === 'financial_model',
  founder_built: (t) => !!t.is_community,
};

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  const user = useStore((state) => state.user);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);

  const [templates, setTemplates] = useState<TemplateDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');
  const [isOpeningGenerator, setIsOpeningGenerator] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const templatesRef = collection(db, 'templates');
        const snapshot = await getDocs(templatesRef);
        const data: TemplateDoc[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data() as any;
          return {
            id: docSnap.id,
            name: d.name,
            document_type: d.document_type,
            category: d.category ?? '',
            sector: d.sector ?? '',
            sector_tags: Array.isArray(d.sector_tags) ? d.sector_tags : [],
            stage: d.stage ?? '',
            stage_tags: Array.isArray(d.stage_tags) ? d.stage_tags : [],
            complexity: d.complexity ?? 'standard',
            is_premium: !!d.is_premium,
            is_community: !!d.is_community,
            created_by: d.created_by,
            rating: d.rating,
            page_count: d.page_count,
            sections_schema: Array.isArray(d.sections_schema)
              ? d.sections_schema
              : [],
            version: d.version ?? 1,
            created_at: d.created_at,
            updated_at: d.updated_at,
          };
        });
        setTemplates(data);
      } catch (e) {
        console.error('Failed to fetch templates', e);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    const byCategory = templates.filter((t) => {
      const fn = categoryToFilter[activeCategory] ?? categoryToFilter.all;
      return fn(t);
    });

    if (!search.trim()) return byCategory;

    const q = search.trim().toLowerCase();
    return byCategory.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.document_type.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [templates, activeCategory, search]);

  const handleUseTemplateAuthed = async (tmpl: TemplateDoc) => {
    if (!user) return;

    try {
      track('template_use_clicked', {
        template_id: tmpl.id,
        document_type: tmpl.document_type,
      });
      const mode = inferRenderMode(tmpl);
      const res = await createWorkspaceFromTemplate({
        userId: user.uid,
        template: tmpl,
        mode,
      });
      navigate(res.route);
    } catch (e: any) {
      console.error('Failed to create document from template', e);
      if (e.message?.includes('FREEMIUM_LIMIT')) {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error(e.message.split(': ')[1], { duration: 5000 });
        });
      }
    }
  };

  const handleUseTemplate = async (tmpl: TemplateDoc) => {
    if (!user) {
      setShowAuthModal(true);
      try {
        window.localStorage.setItem(
          'idealapp_pending_template_action',
          JSON.stringify({
            type: 'use_template',
            templateId: tmpl.id,
          })
        );
      } catch (e) {
        console.warn('Failed to persist pending template action', e);
      }
      return;
    }

    await handleUseTemplateAuthed(tmpl);
  };

  const handleOpenTemplate = (tmpl: TemplateDoc) => {
    if (!tmpl.id) return;
    navigate(`/templates/${tmpl.id}`);
  };

  const openGenerator = () => {
    if (!user) {
      setShowAuthModal(true);
      try {
        window.localStorage.setItem(
          'idealapp_pending_template_action',
          JSON.stringify({
            type: 'generate_template',
          })
        );
      } catch (e) {
        console.warn('Failed to persist pending template action', e);
      }
      return;
    }

    setIsOpeningGenerator(true);
    setShowGenerator(true);
    setTimeout(() => {
      setIsOpeningGenerator(false);
    }, 300);
  };

  // Resume pending template actions after login
  useEffect(() => {
    if (!user) return;

    try {
      const raw = window.localStorage.getItem(
        'idealapp_pending_template_action'
      );
      if (!raw) return;
      const payload = JSON.parse(raw);

      if (payload?.type === 'use_template' && payload.templateId) {
        const tmpl = templates.find((t) => t.id === payload.templateId);
        if (tmpl) {
          handleUseTemplateAuthed(tmpl);
        }
      }

      if (payload?.type === 'generate_template') {
        openGenerator();
      }

      window.localStorage.removeItem('idealapp_pending_template_action');
    } catch (e) {
      console.warn('Failed to restore pending template action', e);
    }
  }, [user, templates]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="h-[60px] border-b border-slate-900 bg-slate-950/80 backdrop-blur flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight">
            Template Library
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600/10 text-indigo-300 border border-indigo-500/40">
            AI Templates
          </span>
        </div>
        <button
          type="button"
          onClick={openGenerator}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          {isOpeningGenerator ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>AI Template Generator</span>
        </button>
      </header>

      <main className="flex">
        {/* Categories Sidebar */}
        <aside className="w-56 border-r border-slate-900 bg-slate-950/90 hidden md:block">
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
                Categories
              </span>
            </div>
            <nav className="space-y-1 text-sm">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg ${
                  activeCategory === 'all'
                    ? 'bg-slate-900 text-slate-50'
                    : 'text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('saas')}
                className={`w-full text-left px-3 py-1.5 rounded-lg ${
                  activeCategory === 'saas'
                    ? 'bg-slate-900 text-slate-50'
                    : 'text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                saas
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('deeptech')}
                className={`w-full text-left px-3 py-1.5 rounded-lg ${
                  activeCategory === 'deeptech'
                    ? 'bg-slate-900 text-slate-50'
                    : 'text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                deeptech
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('fintech')}
                className={`w-full text-left px-3 py-1.5 rounded-lg ${
                  activeCategory === 'fintech'
                    ? 'bg-slate-900 text-slate-50'
                    : 'text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                fintech
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('pitch_decks')}
                className={`w-full text-left px-3 py-1.5 rounded-lg ${
                  activeCategory === 'pitch_decks'
                    ? 'bg-slate-900 text-slate-50'
                    : 'text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                Pitch Decks
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('financial_models')}
                className={`w-full text-left px-3 py-1.5 rounded-lg ${
                  activeCategory === 'financial_models'
                    ? 'bg-slate-900 text-slate-50'
                    : 'text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                Financial Models
              </button>
              <div className="mt-4">
                <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Community
                </span>
                <button
                  type="button"
                  onClick={() => setActiveCategory('founder_built')}
                  className={`mt-1 w-full text-left px-3 py-1.5 rounded-lg ${
                    activeCategory === 'founder_built'
                      ? 'bg-slate-900 text-indigo-300'
                      : 'text-slate-400 hover:bg-slate-900/60'
                  }`}
                >
                  Founder-Built
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Template grid */}
        <section className="flex-1 px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or type…"
                  className="w-full h-9 rounded-lg bg-slate-900 border border-slate-800 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 text-xs">
                  ⌘K
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/templates/custom')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/80 px-4 py-8 text-center text-xs text-slate-400">
              No templates found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tmpl) => (
                <TemplateCard
                  key={tmpl.id}
                  template={tmpl}
                  onUse={handleUseTemplate}
                  onOpen={handleOpenTemplate}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* AI Template Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            key="ai-template-generator"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <AITemplateGenerator
              onClose={() => setShowGenerator(false)}
              onTemplateCreated={(tmpl) =>
                setTemplates((prev) => [tmpl, ...prev])
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesPage;
