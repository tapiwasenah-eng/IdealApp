import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Download, Edit, Save, Eye } from 'lucide-react';
import { useStore } from '../store';
import { nanoid } from 'nanoid';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

// Hardcode relative URI to prevent any Vite env misconfigurations returning HTML (Vite index.html)
const API_URL = '/api';

interface FormData {
  documentType: string;
  companyName: string;
  industry: string;
  stage: string;
  description: string;
  audience: string;
}

export default function GenerateDocumentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useStore();
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    documentType: 'Pitch Deck',
    companyName: '',
    industry: '',
    stage: '',
    description: '',
    audience: 'Investors',
  });

  // Pre-fill from home page input
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill?.full) {
      // Smart parsing of user input
      const input = prefill.full.toLowerCase();
      
      let docType = 'Pitch Deck';
      if (input.includes('business plan')) docType = 'Business Plan';
      else if (input.includes('memo')) docType = 'Investor Memo';
      else if (input.includes('one pager')) docType = 'One Pager';
      else if (input.includes('financial model')) docType = 'Financial Model';
      
      setFormData(prev => ({
        ...prev,
        documentType: docType,
        description: prefill.full,
      }));
      
      setStep(2); // Skip to step 2
    }
  }, [location.state]);

  const updateForm = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    let retryCount = 0;
    const maxRetries = 3;

    const attemptGeneration = async (): Promise<any> => {
      try {
        const response = await fetch(`${API_URL}/generate-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: formData.documentType,
            companyName: formData.companyName,
            industry: formData.industry,
            stage: formData.stage,
            context: formData.description,
            audience: formData.audience,
          }),
        });

        if (response.status === 503) {
          throw new Error('SERVICE_UNAVAILABLE');
        }

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errText = response.statusText;
          if (contentType && contentType.includes('application/json')) {
              try {
                const errBody = await response.json();
                if (errBody.error) errText = errBody.error;
              } catch (e) {
                  // Ignore json parse error
              }
          } else {
              const tempText = await response.text();
              console.error('Non-JSON response:', tempText.substring(0, 200));
              throw new Error(`Server returned non-JSON response (${response.status}).`);
          }
          throw new Error(`Generation failed: ${typeof errText === 'object' ? JSON.stringify(errText) : errText}`);
        }

        const data = await response.json();
        if (!data.content) {
          throw new Error('No content generated');
        }
        return data;

      } catch (error: any) {
        if (error.message === 'SERVICE_UNAVAILABLE' || error.message.includes('503') || error.message.includes('demand')) {
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.min(2000 * retryCount, 8000);
            
            toast.loading(`AI models busy, retrying in ${delay / 1000}s... (${retryCount}/${maxRetries})`, {
              id: 'retry-toast',
            });
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return attemptGeneration(); // Recursive retry
          }
        }
        throw error;
      }
    };

    try {
      toast.loading('Generating document...', { id: 'gen-toast' });
      const result = await attemptGeneration();
      toast.dismiss('retry-toast');
      toast.success('Document created!', { id: 'gen-toast' });

      // Parse AI response into structured sections
      const sections = parseContentIntoSections(result.content, formData.documentType);

      // Create document in local state first
      const docId = nanoid();
      const documentData = {
        id: docId,
        title: `${formData.companyName || 'Untitled'} - ${formData.documentType}`,
        type: formData.documentType,
        sections,
        ownerId: user ? user.uid : 'anonymous',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGeneratedDoc(documentData);

      // Auto-save if logged in
      if (user) {
         try {
             await setDoc(doc(db, 'documents', docId), {
                 ...documentData,
                 createdAt: serverTimestamp(),
                 updatedAt: serverTimestamp()
             });
             toast.success('Document auto-saved to My Projects');
         } catch (saveErr) {
             console.error('Failed to auto-save:', saveErr);
             toast.error('Failed to auto-save document, but generation succeeded!');
         }
      }
      
      // Move to step 3 (Result)
      setStep(3);

    } catch (error: any) {
      console.error('Generation error:', error);
      toast.dismiss('retry-toast');
      toast.error(
        error.message.includes('unavailable') || error.message.includes('503')
          ? 'AI service is experiencing high demand. Please try again in a moment.'
          : error.message || 'Failed to generate document',
        { id: 'gen-toast', duration: 5000 }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const requireAuthAndExecute = async (action: () => void) => {
    if (!user) {
      toast.error('Please sign up or log in to use this feature.');
      navigate('/auth', { state: { returnTo: location.pathname }});
    } else {
      action();
    }
  };

  const handleEdit = () => {
    requireAuthAndExecute(() => {
        navigate(`/editor/${generatedDoc.id}`);
    });
  };

  const handleDownload = () => {
    requireAuthAndExecute(() => {
        const fullText = generatedDoc.sections.map((s: any) => `## ${s.title}\n\n${s.body}`).join('\n\n');
        const blob = new Blob([fullText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedDoc.title}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Document downloaded!');
    });
  };

  const handleSaveToProjects = async () => {
    if (!user) {
       toast.error('Please sign up to save to My Projects.');
       navigate('/auth');
       return;
    }
    
    // It should already be auto-saved, but we can double check
    try {
        await setDoc(doc(db, 'documents', generatedDoc.id), {
             ...generatedDoc,
             ownerId: user.uid,
             createdAt: serverTimestamp(),
             updatedAt: serverTimestamp()
        });
        toast.success('Saved securely to My Projects!');
        navigate('/solutions'); // Or wherever projects are listed
    } catch (err: any) {
        toast.error('Failed to save to projects: ' + err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl font-bold text-slate-900">What are you creating?</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Pitch Deck', 'Business Plan', 'Investor Memo', 'One Pager', 'Financial Model'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    updateForm({ documentType: type });
                    setStep(2);
                  }}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.documentType === type
                      ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <p className="font-semibold text-lg">{type}</p>
                </button>
              ))}
            </div>
            {formData.documentType && (
                <div className="flex justify-end pt-4">
                    <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Next Step</button>
                </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Tell us about your company</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateForm({ companyName: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateForm({ industry: e.target.value })}
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                >
                  <option value="">Select industry</option>
                  {['Fintech', 'Healthtech', 'SaaS', 'E-commerce', 'AI', 'Climate', 'Logistics'].map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => updateForm({ stage: e.target.value })}
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                >
                  <option value="">Select stage</option>
                  {['Idea', 'Pre-seed', 'Seed', 'Series A', 'Growth'].map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="What does your company do? Who do you serve? What problem do you solve?"
                  rows={3}
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-full md:w-auto px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!formData.companyName || !formData.description || isGenerating}
                className="w-full flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate {formData.documentType}
                  </>
                )}
              </button>
            </div>
            {!user && (
              <p className="text-center text-sm text-slate-500 mt-2">
                You can generate a draft without signing in, but you'll need an account to export.
              </p>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
               <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm border border-green-200">
                 <Sparkles className="w-8 h-8" />
               </div>
               <h2 className="text-3xl font-bold text-slate-900">Your {formData.documentType} is ready!</h2>
               <p className="text-slate-600 text-lg max-w-lg mx-auto">
                 We've successfully drafted your document. What would you like to do next?
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
               <button onClick={() => setShowPreview(true)} className="p-6 border border-slate-200 rounded-2xl flex flex-col items-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors gap-3 group text-center">
                   <div className="p-3 bg-white border border-slate-200 rounded-xl group-hover:text-indigo-600 transition-colors shadow-sm"><Eye className="w-6 h-6"/></div>
                   <span className="font-semibold text-slate-800">Preview</span>
                   <span className="text-sm text-slate-500">Read through the newly generated draft contents immediately.</span>
               </button>
               <button onClick={handleDownload} className="p-6 border border-slate-200 rounded-2xl flex flex-col items-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors gap-3 group text-center">
                   <div className="p-3 bg-white border border-slate-200 rounded-xl group-hover:text-indigo-600 transition-colors shadow-sm"><Download className="w-6 h-6"/></div>
                   <span className="font-semibold text-slate-800">Download</span>
                   <span className="text-sm text-slate-500">Export the document as formatted text to your local device.</span>
               </button>
               <button onClick={handleEdit} className="p-6 border border-slate-200 rounded-2xl flex flex-col items-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors gap-3 group text-center">
                   <div className="p-3 bg-white border border-slate-200 rounded-xl group-hover:text-indigo-600 transition-colors shadow-sm"><Edit className="w-6 h-6"/></div>
                   <span className="font-semibold text-slate-800">Edit Online</span>
                   <span className="text-sm text-slate-500">Open in our rich text editor to make further modifications.</span>
               </button>
               <button onClick={handleSaveToProjects} className="p-6 border border-slate-200 rounded-2xl flex flex-col items-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors gap-3 group text-center">
                   <div className="p-3 bg-white border border-slate-200 rounded-xl group-hover:text-indigo-600 transition-colors shadow-sm"><Save className="w-6 h-6"/></div>
                   <span className="font-semibold text-slate-800">My Projects</span>
                   <span className="text-sm text-slate-500">Securely store this document to access and manage later.</span>
               </button>
            </div>
            
            {showPreview && generatedDoc && (
               <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                   <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                       <h3 className="text-xl font-bold text-slate-800">Document Preview</h3>
                       <button onClick={() => setShowPreview(false)} className="text-sm text-slate-500 hover:text-slate-800 font-medium px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">Close Preview</button>
                   </div>
                   <div className="prose prose-slate max-w-none">
                       {generatedDoc.sections.map((sec: any, idx: number) => (
                           <div key={idx} className="mb-6">
                               <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">{sec.title}</h2>
                               <ReactMarkdown>{sec.body}</ReactMarkdown>
                           </div>
                       ))}
                   </div>
               </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-3xl mx-auto px-6 py-8 md:py-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-6 md:p-10 overflow-hidden relative">
          
          {/* Progress indicator */}
          <div className="flex gap-3 mb-10">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < step ? 'bg-indigo-600' : i === step ? 'bg-indigo-500 shadow-sm shadow-indigo-200' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  );
}

// Helper function to parse AI content into sections
function parseContentIntoSections(content: string, docType: string) {
  // Split by common section headers
  const lines = content.split('\n');
  const sections = [];
  let currentSection: any = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect section headers (lines that start with ## or **Section Name**)
    if (trimmed.startsWith('##') || (trimmed.startsWith('**') && trimmed.endsWith('**'))) {
      if (currentSection) {
        sections.push(currentSection);
      }
      
      const title = trimmed.replace(/^##\s*/, '').replace(/\*\*/g, '').trim();
      currentSection = {
        id: nanoid(),
        title,
        body: '',
        order: sections.length,
      };
    } else if (currentSection && trimmed) {
      currentSection.body += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // If no sections found, create default structure
  if (sections.length === 0) {
    return [
      { id: nanoid(), title: 'Executive Summary', body: content, order: 0 },
    ];
  }

  return sections;
}
