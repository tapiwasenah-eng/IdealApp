import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  Lock,
  Crown,
  FileText,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Target,
  Briefcase,
  BarChart2,
  X,
  Eye
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { useStore } from '../store';
import { useDocumentStore } from '../lib/store/useDocumentStore';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../data/seo-schemas';

const CATEGORIES = [
  { id: 'All', label: 'All Templates', icon: FileText },
  { id: 'Pitch Decks', label: 'Pitch Decks', icon: Target },
  { id: 'Business Plans', label: 'Business Plans', icon: Briefcase },
  { id: 'Marketing', label: 'Marketing', icon: FileText },
  { id: 'Legal', label: 'Legal', icon: FileText },
  { id: 'Financial', label: 'Financial', icon: BarChart2 },
  { id: 'HR', label: 'HR', icon: FileText },
  { id: 'Operations', label: 'Operations', icon: FileText },
  { id: 'Enterprise', label: 'Enterprise', icon: FileText },
] as const;

type SortOption = 'popular' | 'newest' | 'az';

const PAGE_SIZE = 12;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
  onPreview,
  isLocked,
  isAnonymous,
}: any) {
  const CategoryIcon = template.category?.toLowerCase().includes('pitch') ? Target : 
                      template.category?.toLowerCase().includes('business') ? Briefcase : 
                      template.category?.toLowerCase().includes('financial') ? BarChart2 : 
                      FileText;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Icon Area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-zinc-50 to-white border-b border-zinc-100 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-2xl scale-150 pointer-events-none">
          <div className="relative w-32 h-32">
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-[#EA580C]" />
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#16A34A]" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-[#3B82F6]" />
            <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-[#8B5CF6]" />
          </div>
        </div>
        
        <div className="relative w-20 h-20 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
          {CategoryIcon && <CategoryIcon className="w-10 h-10" />}
        </div>
        
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/80 backdrop-blur-sm text-zinc-800 uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-white/40">
            {CategoryIcon && <CategoryIcon className="w-3 h-3 text-indigo-600" />}
            {template.category}
          </span>
        </div>

        {template.isPremium && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Crown className="w-3 h-3" />
            PRO
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[#111827] group-hover:text-indigo-600 transition-colors mb-2">
          {template.name || template.title}
        </h3>
        
        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 leading-relaxed flex-1">
          {template.description}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs text-zinc-500 font-medium">{template.pageCount || 0} pages</span>
            </div>
          </div>
          {template.rating != null && <StarRating rating={template.rating} />}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onPreview}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:text-[#111827] hover:border-zinc-300 text-xs font-bold transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={onUse}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-zinc-800 transition-all shadow-md shadow-zinc-200"
          >
            {isAnonymous ? 'Sign Up' : isLocked ? 'Upgrade' : 'Use'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage({ inDashboard }: { inDashboard?: boolean }) {
  const navigate = useNavigate();
  const { user, userProfile } = useStore();
  const { createDocumentFromTemplate } = useDocumentStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);

  const isAnonymous = !user;
  const isPaidOrAdmin = userProfile?.subscription === 'pro' || userProfile?.subscription === 'enterprise' || userProfile?.role === 'admin';

  const filtered = useMemo(() => {
    let result = [...TEMPLATES];

    if (activeCategory !== 'All') {
      result = result.filter((t) => {
        const cat = (t.category ?? '').toLowerCase();
        return cat === activeCategory.toLowerCase() ||
          cat.includes(activeCategory.toLowerCase().replace(/s$/, ''));
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          (t.name ?? t.title ?? '').toLowerCase().includes(q) ||
          (t.description ?? '').toLowerCase().includes(q) ||
          (t.category ?? '').toLowerCase().includes(q)
      );
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    } else if (sortBy === 'az') {
      result.sort((a, b) =>
        (a.name ?? a.title ?? '').localeCompare(b.name ?? b.title ?? '')
      );
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  const handleUse = useCallback(
    (template: any) => {
      if (isAnonymous) {
      navigate('/auth?mode=signup&redirect=templates');
        return;
      }
      if (template.isPremium && !isPaidOrAdmin) {
        navigate('/pricing');
        return;
      }
      const docId = createDocumentFromTemplate(template.id, template);
      navigate(`/documents/${docId}`);
    },
    [isAnonymous, isPaidOrAdmin, navigate, createDocumentFromTemplate]
  );

  const handlePreview = useCallback(
    (template: any) => {
      navigate(`/templates/${template.id}`);
    },
    [navigate]
  );

  const content = (
    <>
      <SEOHead
        title="54 Professional Templates — Pitch Decks, Business Plans & Financial Models"
        description="Choose from 54 professionally designed templates for pitch decks, business plans, financial models, one-pagers, and investor memos. All editable with AI and drag-and-drop."
        keywords="pitch deck templates, business plan templates, financial model templates, startup document templates, investor memo template, one-pager template, data room template, AI presentation templates, free pitch deck template"
        canonicalUrl="https://idealapp.technology/templates"
        ogImage="https://idealapp.technology/og/templates.png"
        structuredData={[organizationSchema, breadcrumbSchema('/templates', 'Templates')]}
      />
      <div className={`min-h-screen bg-white ${inDashboard ? '' : ''}`}>
        {/* Hero Section */}
        <section className={`${inDashboard ? 'pt-8' : 'pt-32'} pb-12 px-6 text-center`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" />
              {TEMPLATES.length}+ Professional Templates
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">
              Find the Perfect Template
            </h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Professionally designed document templates for every business need.
              Customise with your brand in minutes.
            </p>
          </motion.div>
        </section>

        {/* Search + Filters */}
        <div className="px-6 mb-8 max-w-7xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search templates…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[#111827] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:text-[#111827] hover:border-zinc-300 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Sort
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[#111827] text-sm focus:outline-none focus:border-indigo-500 shadow-sm"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="az">A–Z</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap md:flex-nowrap gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 w-full md:w-fit">
            {CATEGORIES.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 md:flex-none ${
                    activeCategory === tab.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="px-6 pb-24 max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg font-medium">No templates found</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-slate-500 font-medium">
                  Showing <span className="text-slate-900 font-bold">1-{Math.min(visibleCount, filtered.length)}</span> of <span className="text-slate-900 font-bold">{filtered.length}</span> Templates
                </p>
                <div className="h-px flex-1 bg-slate-100 mx-6 hidden md:block" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visible.map((template, i) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={() => handleUse(template)}
                    onPreview={() => handlePreview(template)}
                    isLocked={!!(template.isPremium && !isPaidOrAdmin && !isAnonymous)}
                    isAnonymous={isAnonymous}
                  />
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-100"
                  >
                    Load More Templates
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA Section */}
        {!inDashboard && isAnonymous && (
          <section className="py-24 bg-zinc-50">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-4 tracking-tight">
                Ready to build your professional document?
              </h2>
              <p className="text-lg text-zinc-600 mb-10">
                Join thousands of entrepreneurs using Ideal App to create high-quality documents in minutes.
              </p>
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
              >
                Get Started for Free
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  );

  return inDashboard ? content : <PageWrapper>{content}</PageWrapper>;
}
