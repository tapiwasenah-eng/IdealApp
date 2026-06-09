// src/components/wizard/DocumentWizard.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileText,
  Target,
  Rocket,
} from 'lucide-react';
import { doc, serverTimestamp, setDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useStore } from '../../store';
import type { Section, DocumentDoc } from '../../store';
import { track } from '../../lib/analytics';

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
}

interface GenerateDocumentResponse {
  document: {
    name: string;
    document_type: string;
    status: string;
    sections: Array<{
      id?: string;
      title?: string;
      heading?: string;
      content?: string;
      body?: string;
    }>;
  };
}

const STEPS: WizardStep[] = [
  {
    id: 'company',
    title: 'Tell us about your company',
    subtitle: 'We will tailor your deck to your stage, sector and GTM.',
  },
  {
    id: 'fundraise',
    title: 'Describe your raise',
    subtitle: 'We will scaffold the right sections and emphasis.',
  },
  {
    id: 'tone',
    title: 'Choose a style',
    subtitle: 'Pick the level of detail and tone for your deck.',
  },
];

export const DocumentWizard: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setWorkspaceDocument = useStore((state) => state.setWorkspaceDocument);
  const normalizeSections = useStore((state) => state.normalizeSections);

  const location = useLocation();
  const state = location.state as { initialPrompt?: string; documentType?: string } | null;

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [companyDescription, setCompanyDescription] = useState(state?.initialPrompt || '');
  const [fundraiseDetails, setFundraiseDetails] = useState('');
  const [tonePreference, setTonePreference] = useState<'concise' | 'detailed' | 'story'>(
    'concise'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [progressLog, setProgressLog] = useState<
    { id: string; label: string; status: 'pending' | 'generating' | 'done' }[]
  >([
    { id: 'cover', label: 'Generating Cover…', status: 'pending' },
    { id: 'problem', label: 'Generating Problem…', status: 'pending' },
    { id: 'solution', label: 'Generating Solution…', status: 'pending' },
    { id: 'market', label: 'Generating Market…', status: 'pending' },
    { id: 'product', label: 'Generating Product…', status: 'pending' },
    { id: 'traction', label: 'Generating Traction…', status: 'pending' },
    { id: 'financials', label: 'Generating Financials…', status: 'pending' },
  ]);

  const currentStep = STEPS[activeStepIndex];

  const canContinue =
    currentStep.id === 'company'
      ? companyDescription.trim().length > 10
      : currentStep.id === 'fundraise'
      ? fundraiseDetails.trim().length > 10
      : true;

  const handleNextStep = () => {
    if (activeStepIndex < STEPS.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  const updateProgressStatus = (id: string, status: 'pending' | 'generating' | 'done') => {
    setProgressLog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const buildPromptPayload = () => {
    return {
      company: companyDescription.trim(),
      fundraise: fundraiseDetails.trim(),
      tone: tonePreference,
    };
  };

  const mapGeneratedSectionsToWorkspaceSections = (rawSections: any[]): Section[] => {
    // normalizeSections already handles id/title/content/ai_state defaults
    const normalized = normalizeSections(
      rawSections.map((raw, index) => {
        const id =
          typeof raw.id === 'string' && raw.id.trim().length > 0
            ? raw.id
            : `section-${index}`;
        const title =
          typeof raw.title === 'string' && raw.title.trim().length > 0
            ? raw.title
            : typeof raw.heading === 'string'
            ? raw.heading
            : `Section ${index + 1}`;
        const content =
          typeof raw.content === 'string'
            ? raw.content
            : typeof raw.body === 'string'
            ? raw.body
            : '';

        return {
          id,
          title,
          content,
          ai_state: 'generated',
        };
      })
    );

    return normalized;
  };

  const handleGenerate = useCallback(async () => {
    if (!user) {
      navigate('/signup?redirect=/');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    // Reset progress log to "generating"
    setProgressLog((prev) =>
      prev.map((item, idx) => ({
        ...item,
        status: idx === 0 ? 'generating' : 'pending',
      }))
    );

    try {
      const payload = buildPromptPayload();
      track('wizard_started', {
        stage: 'document_generation',
        user_id: user.uid,
      });

      const resp = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Failed to generate document');
      }

      const data: GenerateDocumentResponse = await resp.json();

      // Ensure document fields exist
      const generatedDoc = data.document;
      const name =
        typeof generatedDoc.name === 'string' && generatedDoc.name.trim().length > 0
          ? generatedDoc.name
          : 'AI Generated Deck';

      const document_type =
        typeof generatedDoc.document_type === 'string' &&
        generatedDoc.document_type.trim().length > 0
          ? generatedDoc.document_type
          : 'pitch_deck';

      const status =
        typeof generatedDoc.status === 'string' && generatedDoc.status.trim().length > 0
          ? generatedDoc.status
          : 'draft';

      // Map AI sections into canonical Section[]
      const sections: Section[] = mapGeneratedSectionsToWorkspaceSections(
        generatedDoc.sections || []
      );

      // If no sections came back, still create at least one
      const finalSections: Section[] =
        sections.length > 0
          ? sections
          : [
              {
                id: 'section-0',
                title: 'Overview',
                content: '',
                ai_state: 'idle',
              },
            ];

      // Animate progress log to "done"
      const idsInOrder = ['cover', 'problem', 'solution', 'market', 'product', 'traction', 'financials'];
      idsInOrder.forEach((id, idx) => {
        setTimeout(() => {
          updateProgressStatus(id, 'generating');
        }, idx * 200);
        setTimeout(() => {
          updateProgressStatus(id, 'done');
        }, idx * 200 + 400);
      });

      // Create Firestore doc under users/{uid}/documents/{id}
      const docRef = doc(
        collection(db, 'users', user.uid, 'documents')
      );

      const now = serverTimestamp();

      const payloadToStore = {
        name,
        document_type,
        status,
        sections: finalSections,
        created_at: now,
        updated_at: now,
      };

      await setDoc(docRef, payloadToStore);

      const workspaceDoc: DocumentDoc = {
        id: docRef.id,
        name,
        document_type,
        status,
        sections: finalSections,
      };

      // Hydrate workspace store so DocumentPage can render immediately
      setWorkspaceDocument(workspaceDoc);

      track('doccreated', {
        document_id: docRef.id,
        document_type,
        source: 'wizard',
      });
      track('document_generated_from_wizard', {
        document_id: docRef.id,
        workspace_id: docRef.id,
      });

      // Delay a bit to let "All sections generated" feel real
      setTimeout(() => {
        navigate(`/dashboard/documents/${docRef.id}`);
      }, 600);
    } catch (err: any) {
      console.error('Wizard generation failed', err);
      setGenerationError(err.message || 'Failed to generate document');
      setProgressLog((prev) =>
        prev.map((item) =>
          item.status === 'generating' ? { ...item, status: 'pending' } : item
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }, [user, navigate, setWorkspaceDocument, normalizeSections, companyDescription, fundraiseDetails, tonePreference]);

  useEffect(() => {
    if (!user) {
      // Let anonymous users still see the wizard but require signup on generate
      track('wizard_viewed', { stage: 'entry', authed: false });
    } else {
      track('wizard_viewed', { stage: 'entry', authed: true, user_id: user.uid });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      <header className="h-[64px] flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
            <span className="font-serif font-bold text-sm">I</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">IdealApp</div>
            <div className="text-xs text-white/50">Watch it build your deck</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Generating sections…</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Wizard form */}
        <section className="flex-1 px-6 py-8 lg:px-10 lg:py-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Step {activeStepIndex + 1} of {STEPS.length}
              </span>
              <span className="h-px w-8 bg-white/20" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
              {currentStep.title}
            </h1>
            <p className="text-sm text-white/60 mb-6">
              {currentStep.subtitle}
            </p>

            {currentStep.id === 'company' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-[0.16em]">
                  Company overview
                </label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Describe what your company does, who you serve, and your product in 3–5 sentences."
                  className="w-full h-40 bg-[#050816]/80 border border-white/15 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-electric-violet/60 focus:ring-1 focus:ring-electric-violet/40 placeholder:text-white/30"
                />
              </div>
            )}

            {currentStep.id === 'fundraise' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-[0.16em]">
                  Fundraise details
                </label>
                <textarea
                  value={fundraiseDetails}
                  onChange={(e) => setFundraiseDetails(e.target.value)}
                  placeholder="What are you raising, from whom, and what story do you want to tell?"
                  className="w-full h-40 bg-[#050816] /80 border border-white/15 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-electric-violet/60 focus:ring-1 focus:ring-electric-violet/40 placeholder:text-white/30"
                />
              </div>
            )}

            {currentStep.id === 'tone' && (
              <div className="space-y-4">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-[0.16em]">
                  Tone & style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTonePreference('concise')}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left text-sm ${
                      tonePreference === 'concise'
                        ? 'border-electric-violet bg-electric-violet/10'
                        : 'border-white/15 bg-[#050816]/80'
                    }`}
                  >
                    <span className="font-semibold mb-1">Concise</span>
                    <span className="text-xs text-white/60">
                      Tight, investor‑ready copy.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTonePreference('detailed')}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left text-sm ${
                      tonePreference === 'detailed'
                        ? 'border-electric-violet bg-electric-violet/10'
                        : 'border-white/15 bg-[#050816]/80'
                    }`}
                  >
                    <span className="font-semibold mb-1">Detailed</span>
                    <span className="text-xs text-white/60">
                      More context and explanation.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTonePreference('story')}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left text-sm ${
                      tonePreference === 'story'
                        ? 'border-electric-violet bg-electric-violet/10'
                        : 'border-white/15 bg-[#050816]/80'
                    }`}
                  >
                    <span className="font-semibold mb-1">Story‑driven</span>
                    <span className="text-xs text-white/60">
                      Narrative‑heavy, founder‑voice.
                    </span>
                  </button>
                </div>
              </div>
            )}

            {generationError && (
              <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {generationError}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={activeStepIndex === 0 || isGenerating}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3 h-3" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!canContinue || isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-electric-violet text-white hover:bg-electric-violet/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : activeStepIndex === STEPS.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Watch it build
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Right: "Watch it build" terminal */}
        <section className="w-full lg:w-[420px] border-t lg:border-t-0 lg:border-l border-white/10 bg-gradient-to-b from-[#050816] to-[#050816] relative">
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-electric-violet" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                    Watch it build
                  </div>
                  <div className="text-sm text-white/70">
                    Intelligent scaffolding for your deck
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Live
              </div>
            </div>

            <div className="flex-1 rounded-xl bg-black/60 border border-white/10 p-4 font-mono text-xs text-white/70 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-300">
                  AI Pipeline
                </span>
              </div>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {progressLog.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="text-electric-violet">➜</span>
                    <span className="flex-1">{item.label}</span>
                    <span
                      className={`text-[11px] ${
                        item.status === 'done'
                          ? 'text-emerald-400'
                          : item.status === 'generating'
                          ? 'text-sky-400'
                          : 'text-white/30'
                      }`}
                    >
                      {item.status === 'done'
                        ? 'Done'
                        : item.status === 'generating'
                        ? 'Running'
                        : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="w-3 h-3 text-electric-violet" />
                  <span>All sections generated. Opening Workspace…</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-white/50 flex items-center gap-2">
              <Target className="w-3 h-3" />
              <span>
                Once generated, your deck opens in Docs Space with every section ready to edit.
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DocumentWizard;
