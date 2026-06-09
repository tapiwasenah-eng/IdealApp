// src/pages/SolutionsPage.tsx

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, ChevronDown,
  Sparkles, Eye, ArrowRight, ArrowLeft, X,
  FileText, BarChart2, Target, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '../hooks/useTemplates';
import { useStore } from '../store';
import { createWorkspaceFromTemplate, inferRenderMode } from '../lib/documents';
import { Template } from '../types';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../data/seo-schemas';
import toast from 'react-hot-toast';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PreviewModalState {
  open: boolean;
  template: Template | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'all',             label: 'All Templates',    icon: FileText   },
  { id: 'pitch-deck',     label: 'Pitch Decks',      icon: Target     },
  { id: 'business-plan',  label: 'Business Plans',   icon: Briefcase  },
  { id: 'financial-model',label: 'Financial Models', icon: BarChart2  },
  { id: 'one-pager',      label: 'One-Pagers',       icon: FileText   },
  { id: 'memo',           label: 'Memos',            icon: FileText   },
];

const INDUSTRIES = [
  'All Industries', 'SaaS', 'Fintech', 'Healthcare', 'E-commerce',
  'Deep Tech', 'Consumer', 'Marketplace', 'Climate Tech', 'EdTech',
];

const STAGES = [
  'All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth',
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SolutionsPage() {
  const navigate  = useNavigate();
  const { user } = useStore();
  const {
    templates,
    searchQuery, setSearchQuery,
    activeTab,   setActiveTab,
    industry,    setIndustry,
    stage,       setStage,
    filteredTemplates,
  } = useTemplates();

  // View state
  const [previewModal, setPreviewModal] = useState<PreviewModalState>({ open: false, template: null });
  const [showFilters, setShowFilters] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const requireAuthAndCreate = useCallback(async (template: Template) => {
    if (!user) {
      navigate('/auth?redirect=solutions');
      return;
    }
    
    try {
      toast.loading("Generating workspace...", { id: "gen-doc" });
      const mode = inferRenderMode(template);
      const res = await createWorkspaceFromTemplate({
        userId: user.uid,
        template,
        mode,
      });
      toast.success("Workspace ready!", { id: "gen-doc", duration: 2000 });
      navigate(res.route);
    } catch(err: any) {
      toast.error(err.message || "Failed to create document workspace.", { id: "gen-doc", duration: 3000 });
    }
  }, [user, navigate]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleUseTemplate = useCallback((template: Template) => {
    setPreviewModal({ open: false, template: null });
    requireAuthAndCreate(template);
  }, [requireAuthAndCreate]);

  const handlePreview = useCallback((template: Template) => {
    setPreviewModal({ open: true, template });
  }, []);

  const handleDownloadBlank = useCallback(async (template: Template) => {
    try {
      const { exportGeneratedDocumentToPdf } = await import('../services/exportService');
      const filename = `${template.name.replace(/\s+/g, '_')}_blank`;
      await exportGeneratedDocumentToPdf({ title: template.name, sections: [{ heading: 'Document Ready', content: 'Fill your template' }] }, filename);
    } catch {
      toast.error('Download failed. Please try again.');
    }
  }, []);

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <SEOHead
        title="Solutions for Startups — Investor-Ready Documents with AI"
        description="Ideal App helps startups, founders, and SMEs create investor-ready pitch decks, business plans, and legal documents in minutes. Purpose-built for fundraising and growth."
        keywords="startup document solutions, investor ready pitch deck, AI for startups, fundraising documents software, startup business plan tool, Series A documents, seed stage pitch deck, UK startup tools"
        canonicalUrl="https://idealapp.technology/solutions"
        ogImage="https://idealapp.technology/og/solutions.png"
        structuredData={[organizationSchema, breadcrumbSchema('/solutions', 'Solutions')]}
      />
      <div className="min-h-screen bg-white">
        <AnimatePresence mode="wait">

          {/* ─── VIEW 1: BROWSE ─────────────────────────────────────────────── */}
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero */}
            <section className="pt-32 pb-12 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-medium mb-6">
                  <Sparkles className="w-3 h-3" />
                  {templates.length}+ Professional Templates
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">
                  Startup Playbooks & Templates
                </h1>
                <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                  Start from a battle-tested structure modeled after the fastest growing companies. Let our AI adapt it to your Company DNA.
                </p>
              </motion.div>
            </section>

            {/* Search + Filters */}
            <div className="px-6 mb-8 max-w-7xl mx-auto">
              <div className="flex gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search playbooks or templates..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[#111827] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:text-[#111827] hover:border-zinc-300 transition-colors shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {/* Expanded filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Industry</label>
                        <select
                          value={industry}
                          onChange={e => setIndustry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[#111827] text-sm focus:outline-none focus:border-indigo-500 shadow-sm"
                        >
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Stage</label>
                        <select
                          value={stage}
                          onChange={e => setStage(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[#111827] text-sm focus:outline-none focus:border-indigo-500 shadow-sm"
                        >
                          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tabs */}
            <div className="px-6 mb-8 max-w-7xl mx-auto">
              <div className="flex flex-wrap md:flex-nowrap gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 w-full md:w-fit">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 md:flex-none ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="px-6 pb-24 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template, idx) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    index={idx}
                    onUse={() => handleUseTemplate(template)}
                    onPreview={() => handlePreview(template)}
                  />
                ))}
              </div>

              {filteredTemplates.length > 0 && (
                <div className="mt-16 text-center">
                  <button
                    onClick={() => navigate('/templates')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-100"
                  >
                    View More Templates
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {filteredTemplates.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-zinc-500 text-lg">No templates match your filters.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveTab('all'); setIndustry('All Industries'); setStage('All Stages'); }}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </AnimatePresence>

        {/* ─── PREVIEW MODAL ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {previewModal.open && previewModal.template && (
            <TemplatePreviewModal
              template={previewModal.template}
              onClose={() => setPreviewModal({ open: false, template: null })}
              onUse={() => handleUseTemplate(previewModal.template!)}
              onDownloadBlank={() => handleDownloadBlank(previewModal.template!)}
            />
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function TemplateCard({ template, index, onUse, onPreview }: any) {
  const categoryIcon = template.category === 'pitch-deck' ? Target : 
                      template.category === 'business-plan' ? Briefcase : 
                      template.category === 'financial-model' ? BarChart2 : 
                      FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Icon Area (Glass morph effect) */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-zinc-50 to-white border-b border-zinc-100 flex items-center justify-center">
        {/* Background Logo Mark (Blurred) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-2xl scale-150 pointer-events-none">
          <div className="relative w-32 h-32">
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-[#EA580C]" />
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#16A34A]" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-[#3B82F6]" />
            <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-[#8B5CF6]" />
          </div>
        </div>
        
        {/* Foreground Sector Icon (Glass morph container) */}
        <div className="relative w-20 h-20 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
          {React.createElement(categoryIcon, { className: "w-10 h-10" })}
        </div>
        
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/80 backdrop-blur-sm text-zinc-800 uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-white/40">
            {React.createElement(categoryIcon, { className: "w-3 h-3 text-indigo-600" })}
            {template.category.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-[#111827] group-hover:text-indigo-600 transition-colors">
            {template.name}
          </h3>
          {template.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-600 font-bold uppercase tracking-wider">
              {template.badge}
            </span>
          )}
        </div>
        
        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 leading-relaxed flex-1">{template.description}</p>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs text-zinc-500 font-medium">{template.sections?.length ?? 0} sections</span>
          </div>
          <span className="text-zinc-200">|</span>
          <span className="text-xs text-zinc-500 font-medium">{template.industry}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={e => { e.stopPropagation(); onPreview(); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:text-[#111827] hover:border-zinc-300 text-xs font-bold transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={e => { e.stopPropagation(); onUse(); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-zinc-800 transition-all shadow-md shadow-zinc-200"
          >
            <ArrowRight className="w-4 h-4" />
            Use Template
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TemplatePreviewModal({ template, onClose, onUse, onDownloadBlank }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[90vh] bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 border-b md:border-b-0 md:border-r border-zinc-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">{template.name}</h2>
              <p className="text-zinc-500 max-w-lg leading-relaxed">{template.description}</p>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-zinc-400 hover:text-zinc-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {(template.sections ?? []).map((section: any, i: number) => (
              <div 
                key={i} 
                className="rounded-2xl border border-zinc-100 p-6 transition-all"
                style={{ 
                  backgroundColor: section.backgroundColor || 'rgba(244, 244, 245, 0.5)',
                  color: section.textColor || 'inherit'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span 
                    className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
                    style={{ 
                      backgroundColor: section.textColor ? `${section.textColor}15` : '#EDE9FE',
                      color: section.textColor || '#7C3AED'
                    }}
                  >
                    {i + 1}
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: section.textColor || '#111827' }}>
                    {section.heading}
                  </h4>
                  <span 
                    className="ml-auto px-2 py-0.5 rounded text-[10px] border font-bold uppercase tracking-widest"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: section.textColor ? `${section.textColor}30` : '#E4E4E7',
                      color: section.textColor || '#71717A'
                    }}
                  >
                    {section.type.replace('_', ' ')}
                  </span>
                </div>

                {section.body && (
                  <p className="text-sm leading-relaxed" style={{ color: section.textColor ? `${section.textColor}E6` : '#52525B' }}>
                    {renderBodyWithFields(section.body)}
                  </p>
                )}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.slice(0, 4).map((b: string, j: number) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <div 
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: section.textColor || '#A78BFA' }}
                        />
                        <span style={{ color: section.textColor ? `${section.textColor}E6` : '#52525B' }}>
                          {renderBodyWithFields(b)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 flex-shrink-0 p-8 bg-zinc-50 flex flex-col">
          <div className="hidden md:flex justify-end mb-8">
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 mb-10 flex-1">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Industry</div>
              <div className="text-sm font-bold text-[#111827]">{template.industry}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Stage</div>
              <div className="text-sm font-bold text-[#111827]">{template.stage ?? 'All stages'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Structure</div>
              <div className="text-sm font-bold text-[#111827]">{template.sections?.length ?? 0} sections</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onUse}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <Sparkles className="w-5 h-5" />
              Use This Playbook
            </button>
            <button
              onClick={onDownloadBlank}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-zinc-200 bg-white text-zinc-600 rounded-2xl font-bold text-sm hover:border-zinc-300 hover:text-[#111827] transition-all"
            >
              <FileText className="w-5 h-5" />
              Blank PDF
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function renderBodyWithFields(text: string) {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return parts.map((part, i) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      return (
        <span key={i} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold text-[11px] mx-0.5 border border-indigo-100">
          {part.slice(2, -2).replace(/_/g, ' ')}
        </span>
      );
    }
    return part;
  });
}
