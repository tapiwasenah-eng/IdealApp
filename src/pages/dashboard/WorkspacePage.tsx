// src/pages/dashboard/WorkspacePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { useDocumentStore } from '../../lib/store/useDocumentStore';
import { Section } from '../../lib/store/useDocumentStore';
import { AIChatRail } from '../workspace/AIChatRail';

interface RegenerateStatus {
  [sectionId: string]: 'idle' | 'generating';
}

export const WorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    document: currentDocument,
    loadDocumentById,
    updateSectionContent,
    undoAction,
    history,
    setActiveSection,
    activeSectionId,
  } = useDocumentStore();

  const [regenerateStatus, setRegenerateStatus] = useState<RegenerateStatus>({});
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('hideWorkspaceGuide') !== 'true';
  });
  const [showPreview, setShowPreview] = useState(false);

  const dismissGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hideWorkspaceGuide', 'true');
  };

  useEffect(() => {
    if (!id) return;
    loadDocumentById(id);
  }, [id, loadDocumentById]);

  const handleUndo = () => {
    if (!currentDocument) return;
    if (history.length === 0) return;
    undoAction(currentDocument.id);
  };

  const handleExport = () => {
    if (!currentDocument) return;
    
    // Robust Export merging the latest state with Investor-ready Typography
    const exportHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${currentDocument.title || 'IdealApp Document'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #1e293b;
            line-height: 1.6;
          }
          h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
            color: #0f172a;
          }
          h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.75rem;
            color: #334155;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
          }
          p { margin-bottom: 1.25rem; }
          ul, ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
          li { margin-bottom: 0.5rem; }
          .watermark {
            margin-top: 4rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            color: #94a3b8;
            font-size: 0.875rem;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>${currentDocument.title || 'Document'}</h1>
        ${currentDocument.sections.map(s => `
          <section>
            <h2>${s.title}</h2>
            <div>${s.content || ''}</div>
          </section>
        `).join('')}
        
        <div class="watermark">
          Generated securely with <strong>IdealApp.technology</strong>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([exportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDocument.title || 'Document'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSectionRegenerate = async (section: Section) => {
    if (!currentDocument) return;

    setRegenerateStatus((prev) => ({
      ...prev,
      [section.id]: 'generating',
    }));

    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sectionTitle: section.title,
          companyName: currentDocument.companyName,
          industry: currentDocument.industry,
          description: currentDocument.originalPrompt,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Regenerate failed');
      }

      if (typeof data.content === 'string') {
        updateSectionContent(section.id, data.content);
      }
    } catch (error) {
      console.warn('Regenerate failed, falling back to local sector playbook...', error);

      const industry = (currentDocument?.industry || '').toLowerCase();
      const isFintech = industry.includes('fintech') || industry.includes('payments');
      const localizedContent = isFintech
        ? `<p>Re‑focus this section on regulated, secure APIs, real‑time monitoring, and measurable reductions in fraud and compliance overhead.</p>`
        : `<p>Re‑focus this section on how AI‑driven automation compresses cycle times, improves retention, and compounds recurring revenue.</p>`;

      updateSectionContent(section.id, localizedContent);
    } finally {
      setRegenerateStatus((prev) => ({
        ...prev,
        [section.id]: 'idle',
      }));
    }
  };

  if (!currentDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-sm font-semibold text-gray-900">
              {currentDocument.title || 'Untitled Document'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm border ${
                history.length === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Undo
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Export HTML
            </button>

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Investor View
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sections list */}
        <aside className="col-span-3 border-r border-gray-200 pr-4">
          <h2 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Sections
          </h2>
          <ul className="space-y-2">
            {currentDocument.sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left text-sm rounded-lg px-3 py-2 text-gray-800 transition-colors ${
                    activeSectionId === section.id ? 'bg-indigo-50 font-medium text-indigo-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Canvas */}
        <main className="col-span-6 space-y-6 pb-24">
          {currentDocument.sections.map((section) => (
            <section
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`bg-white rounded-2xl shadow-sm border p-5 space-y-3 cursor-text transition-colors ${
                activeSectionId === section.id ? 'border-indigo-300 ring-2 ring-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                <button
                  type="button"
                  onClick={() => handleSectionRegenerate(section)}
                  disabled={regenerateStatus[section.id] === 'generating'}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs border ${
                    regenerateStatus[section.id] === 'generating'
                      ? 'border-gray-200 text-gray-300 cursor-wait'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {regenerateStatus[section.id] === 'generating' ? 'Regenerating…' : 'Regenerate'}
                </button>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </main>

        {/* AI Document Partner rail (existing components can plug in here) */}
        <aside className="col-span-3">
          <AIChatRail />
        </aside>
      </div>

      {/* First-Run Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
            <div className="p-8">
              <div className="flex items-center justify-center w-12 h-12 mb-6 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">Welcome to your Workspace</h3>
              <p className="mb-6 text-slate-500">
                Take ultimate control of your document with these powerful tools:
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Navigate Sections</h4>
                    <p className="text-sm text-slate-500">Jump between document sections using the left rail.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Regenerate Instantly</h4>
                    <p className="text-sm text-slate-500">Not quite right? Click Regenerate on any section to re-draft it.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">AI Document Partner</h4>
                    <p className="text-sm text-slate-500">Use the chat rail on the right to edit specific phrasing or analyze metrics.</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={dismissGuide}
                className="w-full py-3.5 px-4 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                Let's get started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investor View Modal */}
      {showPreview && currentDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 md:p-8">
           <div className="max-w-4xl mx-auto my-10 relative">
             <div className="p-8 md:p-14 bg-[#faf9f7] border border-slate-200 rounded-[32px] shadow-2xl font-serif relative">
               <div className="flex flex-col md:flex-row justify-between md:items-center mb-12 pb-8 border-b border-slate-200/60 font-sans gap-4">
                   <div>
                     <h3 className="text-sm font-semibold tracking-wider text-indigo-600 uppercase mb-2">Investor View</h3>
                     <p className="text-3xl font-serif text-slate-800 tracking-tight">{currentDocument.title || 'Document Preview'}</p>
                   </div>
                   <button onClick={() => setShowPreview(false)} className="self-start md:self-auto text-sm text-slate-700 hover:text-slate-900 font-semibold px-6 py-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-colors">Close View</button>
               </div>
               <div className="prose prose-slate max-w-none 
                              prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 
                              prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6
                              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                              prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-slate-700
                              prose-li:text-[18px] prose-li:leading-[1.8] prose-li:text-slate-700 prose-li:my-3
                              prose-strong:font-semibold prose-strong:text-slate-900
                              marker:text-indigo-600"
               >
                   {currentDocument.sections.map((sec: any, idx: number) => (
                       <div key={idx} className="mb-16">
                           <h2 className="border-b border-slate-200/60 pb-4">{sec.title}</h2>
                           <div dangerouslySetInnerHTML={{ __html: sec.content || sec.body || '' }} />
                       </div>
                   ))}
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
