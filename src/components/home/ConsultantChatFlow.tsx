import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDocumentFromConsultation } from '../../services/aiService';

export const ConsultantChatFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [state, setState] = useState({
    documentType: '',
    industry: '',
    stage: '',
    description: '',
    audience: '',
    companyName: '',
    website: '',
    country: '',
  });

  const updateState = (key: keyof typeof state, value: string) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  useEffect(() => {
    const handleFillForm = (e: any) => {
      const { highlight1, highlight2 } = e.detail;
      // map the parsed text into our fields
      let docType = 'Other';
      if (highlight1.toLowerCase().includes('pitch deck')) docType = 'Pitch Deck';
      if (highlight1.toLowerCase().includes('business plan')) docType = 'Business Plan';
      if (highlight1.toLowerCase().includes('memo')) docType = 'Investor Memo';
      if (highlight1.toLowerCase().includes('one pager')) docType = 'One Pager';
      if (docType === 'Other') docType = highlight1; // Custom fallback
      
      let ind = 'Other';
      const cat = highlight2.toLowerCase();
      if (cat.includes('fintech')) ind = 'Fintech';
      else if (cat.includes('health')) ind = 'Healthtech';
      else if (cat.includes('logistic')) ind = 'Logistics';
      else if (cat.includes('ecommerce') || cat.includes('market')) ind = 'E-commerce';
      else if (cat.includes('saas') || cat.includes('b2b')) ind = 'SaaS';
      else if (cat.includes('ai')) ind = 'AI';
      else if (cat.includes('climate')) ind = 'Climate';
      else ind = highlight2;

      setState(prev => ({
        ...prev,
        documentType: docType,
        industry: ind,
        description: `We are building a ${highlight2} and we need a ${highlight1}.`
      }));
      setStep(3); // jump to details step
    };
    window.addEventListener('fill-consultant-form', handleFillForm);
    return () => window.removeEventListener('fill-consultant-form', handleFillForm);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const doc = await generateDocumentFromConsultation({
        documentType: state.documentType,
        industry: state.industry,
        stage: state.stage,
        keyDetail: state.description,
        audience: state.audience,
        companyName: state.companyName,
        additionalNotes: `Website: ${state.website}, Country: ${state.country}`,
      });
      // Nav to editor with generated content
      navigate(`/editor/${doc.id}`, { state: { document: doc } });
    } catch (err: any) {
      setError(err.message || 'Failed to generate document');
      setIsGenerating(false);
    }
  };

  const steps = [
    {
      title: "What are you creating today?",
      key: 'documentType',
      options: ['Pitch Deck', 'Business Plan', 'Investor Memo', 'One Pager'],
      allowOther: true
    },
    {
      title: "Which industry best matches your company?",
      key: 'industry',
      options: ['Fintech', 'Healthtech', 'Logistics', 'E-commerce', 'SaaS', 'AI', 'Climate'],
      allowOther: true
    },
    {
      title: "What stage are you at?",
      key: 'stage',
      options: ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Growth', 'Mature'],
      allowOther: false
    },
    {
      title: "In 3–5 sentences, describe what you do and who it's for.",
      key: 'description',
      isTextArea: true,
      helperText: "Example: We help [customer] solve [problem] using [solution]."
    },
    {
      title: "Who is the document for?",
      key: 'audience',
      options: ['Investors', 'Partners', 'Internal team', 'Board'],
      allowOther: true
    },
    {
      title: "Company basics",
      key: 'company',
      isForm: true
    },
    {
      title: "Review",
      key: 'review',
      isReview: true
    }
  ];

  const renderStepContent = () => {
    const current = steps[step];

    if (current.isTextArea) {
      return (
        <div className="space-y-3">
          <textarea
            value={state.description}
            onChange={e => updateState('description', e.target.value)}
            placeholder={current.helperText}
            rows={5}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none resize-none"
          />
        </div>
      );
    }

    if (current.isForm) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name *</label>
            <input 
              value={state.companyName}
              onChange={e => updateState('companyName', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 outline-none"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Website (Optional)</label>
            <input 
              value={state.website}
              onChange={e => updateState('website', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 outline-none"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Country (Optional)</label>
            <input 
              value={state.country}
              onChange={e => updateState('country', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 outline-none"
              placeholder="e.g. United States"
            />
          </div>
        </div>
      );
    }

    if (current.isReview) {
      return (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          {Object.entries(state).map(([k, v]) => {
            if (!v && k !== 'website' && k !== 'country') return null;
            return (
              <div key={k} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500 font-medium capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-sm font-semibold text-slate-900 text-right">{v || '-'}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Default Options
    return (
      <div className="flex flex-wrap gap-2">
        {current.options?.map(opt => (
          <button
            key={opt}
            onClick={() => {
              updateState(current.key as keyof typeof state, opt);
              setTimeout(() => { if (!current.allowOther) nextStep() }, 100);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${state[current.key as keyof typeof state] === opt ? 'bg-violet-600 text-white shadow-md' : 'bg-white border text-slate-700 border-slate-200 hover:border-violet-600 hover:text-violet-700'}`}
          >
            {opt}
          </button>
        ))}
        {current.allowOther && (
          <input 
            type="text"
            placeholder="Other..."
            value={!current.options?.includes(state[current.key as keyof typeof state]) ? state[current.key as keyof typeof state] : ''}
            onChange={e => updateState(current.key as keyof typeof state, e.target.value)}
            className="flex-1 min-w-[120px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 outline-none text-sm"
          />
        )}
      </div>
    );
  };

  const getCanProceed = () => {
    switch (step) {
      case 0: return !!state.documentType;
      case 1: return !!state.industry;
      case 2: return !!state.stage;
      case 3: return !!state.description;
      case 4: return !!state.audience;
      case 5: return !!state.companyName;
      default: return true;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-[200px]">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step > 0 && (
              <button onClick={prevStep} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-violet-600 mb-1">Step {step + 1} of 7</p>
              <h2 className="text-lg font-bold text-slate-900">{steps[step].title}</h2>
            </div>
          </div>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i <= step ? 'bg-violet-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <p className="text-red-500 text-sm mt-4 font-medium">{error}</p>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
             {step < 6 ? (
               <button
                 onClick={nextStep}
                 disabled={!getCanProceed()}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${getCanProceed() ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
               >
                 Next <ChevronRight className="w-4 h-4" />
               </button>
             ) : (
               <button
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-600/20 transition-all disabled:opacity-70"
               >
                 {isGenerating ? 'Generating...' : 'Generate Document'} <ChevronRight className="w-4 h-4" />
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
