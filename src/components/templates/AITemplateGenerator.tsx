// src/components/templates/AITemplateGenerator.tsx

import React, { useState } from 'react';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Loader2, Sparkles } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useStore } from '../../store';
import type { TemplateDoc, Section } from '../../store';
import { normalizeLegacySection } from '../../lib/services/documents';
import { track } from '../../lib/analytics';

interface AITemplateGeneratorProps {
  onClose: () => void;
  onTemplateCreated?: (template: TemplateDoc) => void;
}

interface LlmSection {
  id?: string;
  title?: string;
  heading?: string;
  content?: string;
  body?: string;
}

interface LlmResponse {
  name: string;
  document_type: string;
  category?: string;
  sector?: string;
  sector_tags?: string[];
  stage?: string;
  stage_tags?: string[];
  complexity?: 'light' | 'standard' | 'advanced';
  is_premium?: boolean;
  sections: LlmSection[];
}

const AITemplateGenerator: React.FC<AITemplateGeneratorProps> = ({
  onClose,
  onTemplateCreated,
}) => {
  const user = useStore((state) => state.user);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);

  const [prompt, setPrompt] = useState('');
  const [submitAsCommunity, setSubmitAsCommunity] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!user) {
      setShowAuthModal(true);
      try {
        window.localStorage.setItem(
          'idealapp_pending_template_action',
          JSON.stringify({
            type: 'generate_template',
          })
        );
      } catch (err) {
        console.warn('Failed to persist pending template action', err);
      }
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Call your backend LLM endpoint (Gemini/Claude) to generate a template schema.
      // The endpoint should return a JSON body matching LlmResponse.
      const resp = await fetch('/api/ai-template-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          userId: user.uid,
          submitAsCommunity,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Failed to generate template');
      }

      const data: LlmResponse = await resp.json();

      const templateName =
        typeof data.name === 'string' && data.name.trim().length > 0
          ? data.name
          : 'AI Generated Template';

      const document_type =
        typeof data.document_type === 'string' &&
        data.document_type.trim().length > 0
          ? data.document_type
          : 'pitch_deck';

      const rawSections = Array.isArray(data.sections) ? data.sections : [];
      const sections_schema: any[] = rawSections.map((s, idx) => ({
        id:
          typeof s.id === 'string' && s.id.trim().length > 0
            ? s.id
            : `section-${idx}`,
        heading:
          typeof s.heading === 'string' && s.heading.trim().length > 0
            ? s.heading
            : typeof s.title === 'string'
            ? s.title
            : `Section ${idx + 1}`,
        body:
          typeof s.body === 'string'
            ? s.body
            : typeof s.content === 'string'
            ? s.content
            : '',
      }));

      const complexity: TemplateDoc['complexity'] =
        data.complexity ?? 'standard';

      const now = serverTimestamp();

      const generatedTemplate: Omit<TemplateDoc, 'id'> & {
        created_at: any;
        updated_at: any;
      } = {
        name: templateName,
        document_type,
        category: data.category ?? '',
        sector: data.sector ?? '',
        sector_tags: Array.isArray(data.sector_tags)
          ? data.sector_tags
          : [],
        stage: data.stage ?? '',
        stage_tags: Array.isArray(data.stage_tags)
          ? data.stage_tags
          : [],
        complexity,
        is_premium: !!data.is_premium,
        is_community: submitAsCommunity,
        created_by: user.uid,
        rating: undefined,
        page_count: sections_schema.length,
        sections_schema,
        version: 1,
        created_at: now,
        updated_at: now,
      };

      // Persist to user scope first
      const userTemplatesRef = collection(
        db,
        'users',
        user.uid,
        'templates'
      );
      const userDocRef = await addDoc(userTemplatesRef, generatedTemplate);

      let globalDocRefId: string | undefined;

      if (submitAsCommunity) {
        const globalRef = await addDoc(
          collection(db, 'templates'),
          generatedTemplate
        );
        globalDocRefId = globalRef.id;
      }

      // Build a TemplateDoc shaping the global document if exists
      const templateId = globalDocRefId ?? userDocRef.id;
      const normalizedTemplate: TemplateDoc = {
        id: templateId,
        ...generatedTemplate,
      };

      // Optionally, notify parent so it can insert into local list
      if (onTemplateCreated) {
        onTemplateCreated(normalizedTemplate);
      }

      track('ai_template_generated', {
        user_id: user.uid,
        template_id: templateId,
        document_type,
        is_community: submitAsCommunity,
      });

      onClose();
    } catch (err: any) {
      console.error('AI template generation failed', err);
      setError(err.message || 'Failed to generate template');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-indigo-900/50 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-50">
                Generate AI Template
              </h2>
              <p className="text-xs text-slate-400">
                Describe what you need, and our AI partner will draft sections, guidance, and prompts.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-[0.16em]">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A technical architectural memo for a scalable B2B fintech platform…"
              className="w-full h-32 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="submit-as-community"
              type="checkbox"
              checked={submitAsCommunity}
              onChange={(e) => setSubmitAsCommunity(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
            />
            <label
              htmlFor="submit-as-community"
              className="text-xs text-slate-300"
            >
              Submit as Founder-Built
              <span className="block text-[11px] text-slate-500">
                Share this template with the IdealApp community.
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AITemplateGenerator;
