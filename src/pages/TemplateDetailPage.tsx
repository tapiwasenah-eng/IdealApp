// src/pages/TemplateDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Lock, FileText } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store';
import type { TemplateDoc } from '../store';
import { createWorkspaceFromTemplate, inferRenderMode } from '../lib/documents';
import { track } from '../lib/analytics';
import SEOHead from '../components/Shared/SEOHead';
import toast from 'react-hot-toast';

const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useStore((state) => state.user);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);

  const [template, setTemplate] = useState<TemplateDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingTemplate, setUsingTemplate] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const ref = doc(db, 'templates', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setTemplate(null);
        } else {
          const d = snap.data() as any;
          const tmpl: TemplateDoc = {
            id: snap.id,
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
          setTemplate(tmpl);
        }
      } catch (e) {
        console.error('Failed to load template', e);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id]);

  const handleUseTemplateAuthed = async () => {
    if (!user || !template) return;

    try {
      setUsingTemplate(true);
      track('template_detail_use_clicked', {
        template_id: template.id,
        document_type: template.document_type,
      });
      const mode = inferRenderMode(template);
      const res = await createWorkspaceFromTemplate({
        userId: user.uid,
        template,
        mode,
      });
      navigate(res.route);
    } catch (e: any) {
      console.error('Failed to create document from template', e);
      if (e.message?.includes('FREEMIUM_LIMIT')) {
        toast.error(e.message.split(': ')[1], { duration: 5000 });
      }
    } finally {
      setUsingTemplate(false);
    }
  };

  const handleUseTemplate = () => {
    if (!template) return;

    if (!user) {
      setShowAuthModal(true);
      try {
        window.localStorage.setItem(
          'idealapp_pending_template_action',
          JSON.stringify({
            type: 'use_template',
            templateId: template.id,
          })
        );
      } catch (e) {
        console.warn('Failed to persist pending template action', e);
      }
      return;
    }

    void handleUseTemplateAuthed();
  };

  useEffect(() => {
    if (!user || !template) return;

    try {
      const raw = window.localStorage.getItem('idealapp_pending_template_action');
      if (!raw) return;
      const payload = JSON.parse(raw);

      if (payload?.type === 'use_template' && payload.templateId === template.id) {
        window.localStorage.removeItem('idealapp_pending_template_action');
        handleUseTemplateAuthed();
      }
    } catch (e) {
      console.warn('Failed to restore pending template action', e);
    }
  }, [user, template]);

  const handleDownloadSample = () => {
    track('template_sample_downloaded', { template_id: template?.id });
    toast.success(
      (t) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-800">Sample ready</span>
          <span className="text-sm text-slate-600">Download started. Unlock this full structure inside IdealApp!</span>
          <button onClick={() => toast.dismiss(t.id)} className="mt-2 text-xs text-indigo-600 font-medium">Dismiss</button>
        </div>
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-400">
          Template not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <SEOHead 
        title={`${template.name} Template | IdealApp`} 
        description={template.description || `Use the ${template.name} template to accelerate your workflow. Available in IdealApp.`} 
      />
      <header className="h-[60px] border-b border-slate-900 bg-slate-950/80 backdrop-blur flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
        <button
          type="button"
          onClick={() => navigate('/templates')}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1"
        >
          ← All templates
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadSample}
            className="hidden md:inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handleUseTemplate}
            disabled={usingTemplate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 transition"
          >
            {usingTemplate ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Use template in IdealApp</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">{template.name}</h1>
          <p className="text-lg text-slate-400 mb-6">
            {(template.document_type || 'pitch_deck').replace(/_/g, ' ')} blueprint.
            Create your workspace in one click.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            {template.sector && (
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 shadow-sm">
                Sector: {template.sector}
              </span>
            )}
            {template.stage && (
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 shadow-sm">
                Stage: {template.stage}
              </span>
            )}
            {template.is_community && (
              <span className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-300 border border-indigo-500/30">
                Founder-Built
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              {template.page_count || template.sections_schema?.length || 5} Sections
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Template Structure
          </h2>
          {template.sections_schema.length === 0 ? (
            <p className="text-sm text-slate-500">
              This template framework is dynamic and will be generated in your workspace.
            </p>
          ) : (
            <div className="space-y-4">
              {template.sections_schema.slice(0, 3).map((s, idx) => (
                <div key={s.id ?? idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs font-mono text-slate-500 mb-1">Section {idx + 1}</div>
                  <h3 className="text-base font-medium text-slate-200">{s.heading || (s as any).title || s.type || `Section ${idx + 1}`}</h3>
                  {s.subheading && <p className="text-sm text-slate-400 mt-1">{s.subheading}</p>}
                </div>
              ))}
              
              {template.sections_schema.length > 3 && (
                <div className="relative pt-8 pb-16 flex flex-col items-center justify-center bg-slate-950/20 rounded-xl border border-dashed border-slate-700/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col items-center justify-end pb-8 z-10 backdrop-blur-[1px]">
                    <div className="h-12 w-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
                      <Lock className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-base text-white font-medium mb-2">+{template.sections_schema.length - 3} more sections hidden</p>
                    <p className="text-sm text-slate-400 mb-6 text-center px-4 max-w-sm">Unlock the full structure, analytics, layout suggestions, and AI drafting capabilities by creating a free workspace.</p>
                    <button onClick={handleUseTemplate} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Workspace Free
                    </button>
                  </div>
                  
                  {/* Faux blurred sections underneath */}
                  <div className="w-full px-4 space-y-4 opacity-30 select-none">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 blur-sm filter">
                      <div className="h-3 w-16 bg-slate-700 rounded mb-2"></div>
                      <div className="h-5 w-48 bg-slate-600 rounded"></div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 blur-md filter">
                      <div className="h-3 w-16 bg-slate-700 rounded mb-2"></div>
                      <div className="h-5 w-48 bg-slate-600 rounded"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TemplateDetailPage;
