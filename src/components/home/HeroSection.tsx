// src/components/home/HeroSection.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useStore } from '../../store';

type DocumentType = 'pitch_deck' | 'business_plan' | 'financial_model';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);

  const [prompt, setPrompt] = useState('');
  const [documentType, setDocumentType] =
    useState<DocumentType>('pitch_deck');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!user) {
      setShowAuthModal(true);
      try {
        window.localStorage.setItem(
          'idealapp_pending_action',
          JSON.stringify({
            type: 'hero_generate',
            prompt: prompt.trim(),
            documentType,
          })
        );
      } catch (e) {
        console.warn('Failed to persist hero pending action', e);
      }
      return;
    }

    setIsGenerating(true);

    // Navigate to the wizard with router state carrying the initial prompt
    // and selected document type so the wizard can prefill context.
    navigate('/wizard', {
      state: {
        initialPrompt: prompt.trim(),
        documentType,
      },
    });

    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  useEffect(() => {
    if (!user) return;

    try {
      const raw = window.localStorage.getItem('idealapp_pending_action');
      if (!raw) return;
      const payload = JSON.parse(raw);

      if (payload?.type === 'hero_generate') {
        window.localStorage.removeItem('idealapp_pending_action');
        navigate('/wizard', {
          state: {
            initialPrompt: payload.prompt || '',
            documentType: payload.documentType || 'pitch_deck',
          },
        });
      }
    } catch (e) {
      console.warn('Failed to restore pending hero action', e);
    }
  }, [user, navigate]);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/95 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-16 sm:pb-20 lg:pt-24 lg:pb-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Left column: copy */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-200">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>The AI venture platform for founders</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              Build Investor‑Ready Decks
              <span className="block text-indigo-300">on Autopilot.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl">
              From voice notes to a polished pitch deck, an intelligent data room,
              and a targeted investor list in minutes.
            </p>
          </div>

          {/* Right column: prompt bar */}
          <div className="flex-1 w-full max-w-lg">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-2xl shadow-indigo-900/40 px-4 py-4 sm:px-5 sm:py-5 backdrop-blur">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-[0.16em] mb-2 block">
                Start with an idea
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-3 py-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your startup idea or paste notes here…"
                    className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="ml-3 inline-flex items-center gap-2 rounded-lg bg-slate-100 text-slate-900 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        Generate
                        <span className="text-[13px]">→</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDocumentType('pitch_deck')}
                    className={`px-3 py-1.5 rounded-full border ${
                      documentType === 'pitch_deck'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Pitch Deck
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentType('business_plan')}
                    className={`px-3 py-1.5 rounded-full border ${
                      documentType === 'business_plan'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Business Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentType('financial_model')}
                    className={`px-3 py-1.5 rounded-full border ${
                      documentType === 'financial_model'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Financial Model
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Tip: Paste your latest investor email, memo, or voice note. IdealApp
                  will scaffold the deck and data room for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
