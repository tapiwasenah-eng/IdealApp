import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, Share2, X, Plus, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppStore } from '../../store/appStore';
import { track } from '../../lib/analytics';
import { GenerationLoadingView } from './GenerationLoadingView';

export function FirstSessionWizard() {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocId, setGeneratedDocId] = useState<string | null>(null);
  const [isSelectingDocType, setIsSelectingDocType] = useState(false);
  
  const navigate = useNavigate();
  const { user, companyDna, modals, setModalState } = useAppStore();

  const isOpen = modals.bringMaterialOpen;

  if (!isOpen) return null;

  const onClose = () => setModalState('bringMaterialOpen', false);

  const handleNext = () => {
    if (step === 1 && !stage) return;
    setStep(s => s + 1);
  };

  const handleUpload = async () => {
    track('doc_created', { source: 'onboarding_upload' });
    if (!user) return;
    
    setIsGenerating(true);
    
    // Simulate generation delay within GenerationLoadingView
    // Create doc beforehand so we can navigate to it
    try {
      const docRef = await addDoc(
        collection(db, "users", user.uid, "documents"),
        {
          name: "Generated Pitch Deck",
          document_type: "pitch_deck",
          source: "upload",
          sections: [
            { id: "problem", title: "Problem", content: "AI identified problem statement...", ai_state: "idle" },
            { id: "solution", title: "Solution", content: "AI identified solution...", ai_state: "idle" }
          ],
          status: "draft",
          stage: stage || companyDna?.stage || null,
          sector: companyDna?.sector || null,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }
      );
      setGeneratedDocId(docRef.id);
    } catch (err) {
      console.error("Failed to generate document", err);
      setIsGenerating(false);
      handleNext();
    }
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    if (generatedDocId) {
      navigate(`/dashboard/documents/${generatedDocId}`);
      onClose();
    } else {
      handleNext();
    }
  };

  const handleTemplate = () => {
    track('template_used', { source: 'onboarding_start' });
    navigate('/templates');
    onClose();
  };

  const handleBlank = () => {
    setIsSelectingDocType(true);
  };

  const handleCreateBlankDoc = async (typeId: string, typeName: string) => {
    track('doc_created', { source: 'onboarding_blank', type: typeId });
    if (user) {
      // Setup some default sections based on type
      let defaultSections = [
        { id: "overview", title: "Overview", content: "Executive summary...", ai_state: "idle" }
      ];
      if (typeId === 'pitch_deck') {
        defaultSections = [
          { id: "problem", title: "Problem", content: "Describe the problem...", ai_state: "idle" },
          { id: "solution", title: "Solution", content: "Describe the solution...", ai_state: "idle" },
          { id: "market", title: "Market Size", content: "TAM/SAM/SOM...", ai_state: "idle" }
        ];
      } else if (typeId === 'business_plan') {
         defaultSections = [
          { id: "exec_summary", title: "Executive Summary", content: "Overview of the business...", ai_state: "idle" },
          { id: "operations", title: "Operations", content: "Operations plan...", ai_state: "idle" },
         ];
      }

      try {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "documents"),
          {
            name: `Untitled ${typeName}`,
            document_type: typeId,
            source: "blank",
            status: "draft",
            sections: defaultSections,
            stage: stage || companyDna?.stage || null,
            sector: companyDna?.sector || null,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          }
        );
        navigate(`/dashboard/documents/${docRef.id}`);
      } catch (err) {
         console.error("error creating blank doc", err);
         navigate('/dashboard/documents');
      }
    } else {
      navigate('/dashboard/documents');
    }
    onClose();
  };

  const handleShareInvestor = () => {
    track('investor_touchpoint_created', { action: 'initial_share' });
    navigate('/outreach');
    onClose();
  };

  const handleDataRoom = () => {
    track('doc_added_to_dataroom', { source: 'onboarding' });
    navigate('/data-room');
    onClose();
  };

  const handleSaveForLater = () => {
    onClose();
  };

  if (isGenerating) {
    return <GenerationLoadingView onComplete={handleGenerationComplete} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col relative bg-[#0A0D14]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 border-b border-white/5 flex gap-2">
           <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-electric-violet' : 'bg-white/10'}`} />
           <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-electric-violet' : 'bg-white/10'}`} />
           <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-electric-violet' : 'bg-white/10'}`} />
        </div>

        <div className="p-8 flex-1 min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 className="text-3xl font-serif text-white mb-2">What are you raising?</h2>
                 <p className="text-text-muted mb-8">This helps us tailor your company DNA and template recommendations.</p>
                 <div className="grid grid-cols-2 gap-4">
                   {['Pre-Seed', 'Seed', 'Series A', 'Bridge / Extension'].map(s => (
                     <button
                       key={s}
                       onClick={() => setStage(s)}
                       className={`p-4 rounded-xl border text-left transition-all ${stage === s ? 'border-electric-violet bg-electric-violet/10 text-white' : 'border-white/10 text-white/70 hover:bg-white/5 hover:border-white/30'}`}
                     >
                       {s}
                     </button>
                   ))}
                 </div>
              </motion.div>
            )}

            {isSelectingDocType ? (
              <motion.div key="step-doctype" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 className="text-3xl font-serif text-white mb-2">What are you creating?</h2>
                 <p className="text-text-muted mb-8">Choose a document type to start with the right sections tailored for your stage.</p>
                 
                 <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'pitch_deck', name: 'Pitch Deck' },
                     { id: 'business_plan', name: 'Business Plan' },
                     { id: 'employee_handbook', name: 'Employee Handbook' },
                     { id: 'founder_memo', name: 'Founder Memo' }
                   ].map(type => (
                     <button
                       key={type.id}
                       onClick={() => handleCreateBlankDoc(type.id, type.name)}
                       className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-left flex items-center justify-between"
                     >
                       <span className="font-medium text-white">{type.name}</span>
                       <ChevronRight className="w-5 h-5 text-white/30" />
                     </button>
                   ))}
                 </div>
              </motion.div>
            ) : step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 className="text-3xl font-serif text-white mb-2">Bring your existing material</h2>
                 <p className="text-text-muted mb-8">Start with what you have. We'll run a first-pass AI summary automatically.</p>
                 
                 <div className="space-y-4">
                   <button onClick={handleUpload} className="w-full p-6 border-2 border-dashed border-electric-violet/30 bg-electric-violet/5 rounded-2xl flex items-center gap-4 hover:bg-electric-violet/10 hover:border-electric-violet/50 transition-colors group text-left">
                      <div className="w-12 h-12 rounded-xl bg-electric-violet/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Upload className="w-6 h-6 text-electric-violet" />
                      </div>
                      <div>
                         <div className="text-lg font-semibold text-white">Upload existing deck</div>
                         <div className="text-sm text-text-muted">PDF, PPTX, or DOCX</div>
                      </div>
                   </button>
                   
                   <div className="flex gap-4">
                      <button onClick={handleTemplate} className="flex-1 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Start from template</div>
                          <div className="text-xs text-text-muted">IdealApp winners</div>
                        </div>
                        <FileText className="w-5 h-5 text-white/50" />
                      </button>
                      <button onClick={handleBlank} className="flex-1 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Start from blank</div>
                          <div className="text-xs text-text-muted">Empty workspace</div>
                        </div>
                        <Plus className="w-5 h-5 text-white/50" />
                      </button>
                   </div>
                 </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 className="text-3xl font-serif text-white mb-2">Who should see this first?</h2>
                 <p className="text-text-muted mb-8">Your initial document is ready. What's the next step?</p>
                 
                 <div className="space-y-3">
                   <button onClick={handleShareInvestor} className="w-full p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-5 h-5 text-trust-blue" />
                        <div>
                          <div className="font-medium text-white">Send to an investor</div>
                          <div className="text-xs text-text-muted">Draft a tracked email</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70" />
                   </button>
                   <button onClick={handleDataRoom} className="w-full p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-investor-gold" />
                        <div>
                          <div className="font-medium text-white">Create a private data room</div>
                          <div className="text-xs text-text-muted">Secure folder setup</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70" />
                   </button>
                   <button onClick={handleSaveForLater} className="w-full p-4 border border-white/10 rounded-xl bg-transparent hover:bg-white/5 transition-colors text-left flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-5" />
                        <div>
                          <div className="font-medium text-white/70">Save for later</div>
                          <div className="text-xs text-text-muted">Return to overview</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70" />
                   </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step < 3 && (
          <div className="p-6 border-t border-white/5 flex justify-end">
            <button 
              className={`px-6 py-2.5 rounded-full font-medium ${step === 1 && !stage ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white text-obsidian hover:bg-gray-200'}`}
              onClick={handleNext}
              disabled={step === 1 && !stage}
            >
              Continue
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
