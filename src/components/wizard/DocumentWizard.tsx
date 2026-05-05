import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { fetchWithAuth } from '../../lib/api';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

interface WizardState {
  documentType: string;
  industry: string;
  stage: string;
  description: string;
  keyMetrics: string;
  additionalContext: string;
  audience: string;
  companyName: string;
  website: string;
  preferredModel: string;
}

const DEFAULT_STATE: WizardState = {
  documentType: '',
  industry: '',
  stage: '',
  description: '',
  keyMetrics: '',
  additionalContext: '',
  audience: '',
  companyName: '',
  website: '',
  preferredModel: 'gemini',
};

const DOC_TYPES = ['Pitch Deck', 'Business Plan', 'Investor Memo', 'One Pager', 'Financial Model', 'Marketing Strategy'];
const INDUSTRIES = ['Fintech', 'Healthtech', 'SaaS', 'E-commerce', 'AI', 'Logistics', 'Climate', 'Marketplace'];
const STAGES = ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Growth', 'Mature'];
const AUDIENCES = ['Investors', 'Internal Team', 'Partners', 'Board', 'Customers'];

export default function DocumentWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState<{claude: boolean, gemini: boolean}>({claude: false, gemini: false});

  useEffect(() => {
    // Load draft
    const saved = localStorage.getItem('idealapp_wizard_draft_v1');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {}
    }
    
    // Check prefill
    if (location.state?.prefill) {
      const p = location.state.prefill;
      let dt = 'Pitch Deck';
      if (p.full.toLowerCase().includes('business plan')) dt = 'Business Plan';
      if (p.full.toLowerCase().includes('model')) dt = 'Financial Model';
      if (p.full.toLowerCase().includes('memo')) dt = 'Investor Memo';
      if (p.full.toLowerCase().includes('one pager')) dt = 'One Pager';
      setState(s => ({ ...s, documentType: dt, description: p.full }));
      setStep(2);
    }
    
    // Fetch AI status
    fetchWithAuth('/api/ai-status').then(res => {
      setAiStatus({ claude: !!res.claude, gemini: !!res.gemini });
    }).catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('idealapp_wizard_draft_v1', JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<WizardState>) => {
    setState(s => ({ ...s, ...updates }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 7));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetchWithAuth('/api/generate-document', {
        method: 'POST',
        body: JSON.stringify({
          documentType: state.documentType || 'Pitch Deck',
          companyName: state.companyName || 'My Company',
          industry: state.industry,
          description: state.description,
          stage: state.stage,
          targetAudience: state.audience,
          keyMetrics: state.keyMetrics,
          additionalContext: state.additionalContext,
          preferredModel: state.preferredModel
        })
      });

      if (!response.document || !response.document.sections) {
         throw new Error("Invalid response format from AI");
      }

      const docId = nanoid();
      const newDocId = user ? docId : `local-${docId}`;
      const docData = {
         id: newDocId,
         title: response.document.title || `${state.companyName} ${state.documentType}`,
         sections: response.document.sections,
         canvasJSON: null, // canvas will be generated dynamically 
         status: 'complete',
         type: state.documentType,
         ownerId: user?.uid || 'anonymous',
         collaborators: [],
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString()
      };

      if (user) {
        await setDoc(doc(db, 'documents', docId), {
           ...docData,
           createdAt: serverTimestamp(),
           updatedAt: serverTimestamp()
        });
      } else {
        localStorage.setItem(`doc_${newDocId}`, JSON.stringify(docData));
      }

      localStorage.removeItem('idealapp_wizard_draft_v1');
      navigate(`/editor/${newDocId}`);
    } catch (err: any) {
      toast.error(err.message || "Generation failed. Try again.");
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">What are you creating today?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DOC_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => { updateState({ documentType: t }); handleNext(); }}
                  className={`p-4 text-center border rounded-2xl transition-all ${state.documentType === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <span className="font-semibold text-sm md:text-base">{t}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Which industry best matches your company?</h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {INDUSTRIES.map(t => (
                <button
                  key={t}
                  onClick={() => { updateState({ industry: t }); handleNext(); }}
                  className={`px-5 py-3 border rounded-full transition-all ${state.industry === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 hover:border-indigo-300 font-medium'}`}
                >
                  {t}
                </button>
              ))}
              <input 
                type="text" 
                placeholder="Other..." 
                className="px-5 py-3 border border-slate-200 rounded-full focus:outline-none focus:border-indigo-600 outline-none text-base w-32 md:w-auto"
                value={!INDUSTRIES.includes(state.industry) ? state.industry : ''}
                onChange={e => updateState({ industry: e.target.value })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">What stage are you at?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STAGES.map(t => (
                <button
                  key={t}
                  onClick={() => { updateState({ stage: t }); handleNext(); }}
                  className={`p-4 text-center border rounded-2xl transition-all ${state.stage === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <span className="font-semibold text-sm md:text-base">{t}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Tell us what you do</h2>
            <textarea
              className="w-full p-4 border border-slate-200 rounded-2xl min-h-[120px] text-[16px] outline-none focus:border-indigo-600"
              placeholder="Example: We help startups solve data silos using AI..."
              value={state.description}
              onChange={e => updateState({ description: e.target.value })}
            />
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Key Metrics (Optional)</label>
                <input 
                  type="text"
                  className="w-full p-3 md:p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 text-[16px]"
                  placeholder="e.g. $10k MRR, 5000 users"
                  value={state.keyMetrics}
                  onChange={e => updateState({ keyMetrics: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Additional Context (Optional)</label>
                <input 
                  type="text"
                  className="w-full p-3 md:p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 text-[16px]"
                  placeholder="e.g. Based in London, fully remote team"
                  value={state.additionalContext}
                  onChange={e => updateState({ additionalContext: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Who is this document for?</h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {AUDIENCES.map(t => (
                <button
                  key={t}
                  onClick={() => { updateState({ audience: t }); handleNext(); }}
                  className={`px-5 py-3 border rounded-full transition-all ${state.audience === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 hover:border-indigo-300 font-medium'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Company Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Company Name *</label>
                <input 
                  type="text"
                  className="w-full p-3 md:p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 text-[16px]"
                  placeholder="Ideal Startup Inc."
                  value={state.companyName}
                  onChange={e => updateState({ companyName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Website (Optional)</label>
                <input 
                  type="text"
                  className="w-full p-3 md:p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 text-[16px]"
                  placeholder="https://..."
                  value={state.website}
                  onChange={e => updateState({ website: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">Review & Generate</h2>
              
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => updateState({ preferredModel: 'gemini' })}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${state.preferredModel === 'gemini' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >
                  Fast (Gemini)
                </button>
                <button 
                  onClick={() => updateState({ preferredModel: 'claude' })}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${state.preferredModel === 'claude' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                  disabled={!aiStatus.claude && aiStatus.gemini}
                >
                  Best (Claude)
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {[
                { label: 'Document Type', value: state.documentType, s: 1 },
                { label: 'Industry', value: state.industry, s: 2 },
                { label: 'Stage', value: state.stage, s: 3 },
                { label: 'Description', value: state.description, s: 4 },
                { label: 'Audience', value: state.audience, s: 5 },
                { label: 'Company', value: state.companyName, s: 6 },
              ].map(row => (
                <div key={row.label} className="p-4 flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{row.label}</p>
                    <p className="text-sm text-slate-900 font-medium line-clamp-2">{row.value || '-'}</p>
                  </div>
                  <button onClick={() => setStep(row.s)} className="text-indigo-600 text-sm font-bold hover:underline shrink-0">
                    Edit
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <Sparkles size={14} /> AI Ready: {aiStatus.claude && aiStatus.gemini ? 'Claude & Gemini' : (aiStatus.claude ? 'Claude' : (aiStatus.gemini ? 'Gemini' : 'No Keys'))}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-safe-top">
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-50">
        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${(step / 7) * 100}%` }} />
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24 md:pb-32 px-6 pt-12 md:pt-24 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full border-t border-slate-200 bg-white/80 backdrop-blur-xl p-4 pb-safe-bottom z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={step === 1 ? () => navigate(-1) : handlePrev}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0 outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 text-center hidden md:block text-sm font-semibold text-slate-500">
            Step {step} of 7
          </div>

          <button
            onClick={step === 7 ? handleGenerate : handleNext}
            disabled={isGenerating}
            className="flex-1 md:flex-none md:w-auto px-8 h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 outline-none disabled:opacity-50"
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" size={20} /> Generating...</>
            ) : step === 7 ? (
              <>Generate <Sparkles size={18} /></>
            ) : (
              <>Next <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
