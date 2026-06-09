import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionNavigator } from "./SectionNavigator";
import { DocumentCanvas } from "./DocumentCanvas";
import { AIChatRail } from "./AIChatRail";
import { designSystem } from "../../lib/design-system";
import { useDocumentStore } from "../../lib/store/useDocumentStore";
import { ArrowLeft, View } from "lucide-react";
import { auth } from "../../lib/firebase";
import { motion } from "framer-motion";

export const DocumentWorkspaceLayout: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  // Do not name local variables 'document' here; use 'docState' to avoid shadowing global document object
  const { document: docState, loadDocument, investorView, setInvestorView, undoAction, history } =
    useDocumentStore();
  const { colors, typography, componentVariants } = designSystem;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [nudgeShown, setNudgeShown] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDoc = async () => {
      if (documentId) {
        setLoading(true);
        await loadDocument(documentId);
        if (mounted) setLoading(false);
      }
    };
    fetchDoc();
    setMounted(true);
    return () => { mounted = false; };
  }, [documentId, loadDocument]);

  useEffect(() => {
    if (!docState || nudgeShown) return;
    
    // Check if >= 3 sections with content
    const filledSections = docState.sections.filter((s: any) => s.content && s.content.trim().length > 10);
    if (filledSections.length >= 3) {
      setNudgeShown(true);
      import('react-hot-toast').then(({ default: toast }) => {
        toast((t) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800">This is looking strong.</span>
            <span className="text-sm text-slate-600">Share a read‑only link with investors in 1 click.</span>
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => {
                  toast.dismiss(t.id);
                  const menu = document.getElementById("share-menu");
                  if (menu) menu.style.display = "block";
                }} 
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
              >
                Share now
              </button>
              <button onClick={() => toast.dismiss(t.id)} className="text-xs text-slate-500 hover:text-slate-700">Dismiss</button>
            </div>
          </div>
        ), { duration: 8000, position: 'bottom-right' });
      });
    }
  }, [docState, nudgeShown]);

  if (!mounted || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAFAFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-slate-500 font-medium text-sm">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (!loading && !docState) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFF] p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Document Not Found</h2>
        <p className="text-slate-500 mb-6 text-center max-w-sm">The document you are looking for might have been deleted, or you might not have access to it.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#FAFAFF] text-slate-800 overflow-hidden">
      {/* Top Navigation Bar */}
      <header
        className="h-[60px] flex-shrink-0 flex items-center justify-between px-4 bg-white border-b z-10"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold hidden md:inline">
              Dashboard
            </span>
          </button>

          <div className="h-4 w-px bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <span
              className={`${componentVariants.badge.base} ${componentVariants.badge.docType.pitchDeck} !py-0.5 !px-2 !text-[10px]`}
            >
              {docState.type}
            </span>
            <span className="text-sm font-medium text-slate-400">/</span>
            <span className="text-sm font-semibold text-slate-700">
              {docState.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => {
              if (docState) {
                undoAction(docState.id);
              }
            }}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Undo
          </button>
          <button
            onClick={() => setInvestorView(!investorView)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg border transition-colors flex items-center gap-2 ${investorView ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
          >
            <View size={16} />
            {investorView ? "Exit Investor View" : "Investor View"}
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const menu = document.getElementById("share-menu");
                if (menu) {
                  menu.style.display = menu.style.display === "block" ? "none" : "block";
                }
              }}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Share ▾
            </button>
            <div id="share-menu" className="hidden absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
              <button
                onClick={() => {
                  document.getElementById("share-menu")!.style.display = "none";
                  import('../../lib/analytics').then(({ track }) => {
                    track('investor_view_link_created', { document_id: documentId, workspace_id: documentId });
                    track('shared_link_created', { doc_id: documentId, type: 'investor_view', loopType: 'share-investor-view' });
                  });
                  alert(`Sharable Investor View link generated!\n\nLink: https://idealapp.test/view/${documentId}\n\n(This creates an investor view entry in Firestore and tracking metrics.)`);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Share as Investor View
              </button>
              <button
                onClick={async () => {
                   document.getElementById("share-menu")!.style.display = "none";
                   if (!docState) return;

                   try {
                     const { auth, db } = await import('../../lib/firebase');
                     const { addDoc, collection } = await import('firebase/firestore');
                     const { trackTemplateEvent } = await import('../../lib/analytics');
                     
                     if (!auth.currentUser) return;
                     
                     // Synthesize sections_schema
                     const sections_schema = docState.sections.map((s) => ({
                       id: s.id,
                       type: 'text',
                       heading: s.title,
                       subheading: '',
                       body: s.content?.replace(/<[^>]+>/g, '') || '', // stripping HTML as basic clean
                       bullets: [],
                       metrics: []
                     }));

                     const templateData = {
                       name: `${docState.title} Template`,
                       document_type: docState.type || "pitch_deck",
                       category: "Founder-Built",
                       sector: docState.industry || "general",
                       sector_tags: [docState.industry || "general"],
                       stage: "all",
                       stage_tags: ["all"],
                       complexity: "standard",
                       is_premium: true, // Pro feature
                       is_community: true,
                       created_by: auth.currentUser.uid,
                       version: 1,
                       sections_schema
                     };

                     // Save to user templates
                     await addDoc(collection(db, "users", auth.currentUser.uid, "templates"), templateData);
                     // Submit to community templates
                     const templateDocRef = await addDoc(collection(db, "templates"), templateData);

                     trackTemplateEvent('template_used', { action: 'saved_as_community_template', document_id: documentId, template_id: templateDocRef.id, category: "Founder-Built", sector: docState.industry || "general", is_community: true, is_premium: true });
                     alert("Successfully saved anonymised document to Community Templates.");
                     navigate('/templates/community');
                   } catch (err) {
                     console.error("Failed to save as template", err);
                     alert("Failed to save as template.");
                   }
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 border-t border-slate-100"
              >
                Save as Community Template <span className="text-xs bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded ml-2">Pro</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const menu = document.getElementById("export-menu");
                if (menu) {
                  menu.style.display = menu.style.display === "block" ? "none" : "block";
                }
              }}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg text-white transition-colors"
              style={{ background: colors.primary.obsidian }}
            >
              Export ▾
            </button>
            <div id="export-menu" className="hidden absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
              <button
                onClick={async () => {
                  document.getElementById("export-menu")!.style.display = "none";
                  try {
                    const { checkExportLimit } = await import('../../lib/exportLimits');
                    if (auth.currentUser) {
                      await checkExportLimit(auth.currentUser.uid);
                    }
                    const res = await fetch(`/api/export/pdf/${documentId}`);
                    if (!res.ok) throw new Error("Export failed");
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${docState?.title || 'document'}.pdf`;
                    a.click();
                    import('../../lib/analytics').then(({ track }) => {
                       track('document_exported', { document_id: documentId, format: 'pdf' });
                       track('shared_link_created', { doc_id: documentId, type: 'export', loopType: 'export-pdf' });
                    });
                    import('react-hot-toast').then(({ default: toast }) => {
                      toast.success(
                        (t) => (
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-800">Export Complete!</span>
                            <span className="text-sm text-slate-600">Loved this deck? Invite your co-founder to refine it with AI in one click.</span>
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => toast.dismiss(t.id)} className="text-xs text-slate-500 hover:text-slate-700">Dismiss</button>
                            </div>
                          </div>
                        ),
                        { duration: 6000 }
                      );
                    });
                  } catch (e: any) {
                    if (e.message?.includes('FREEMIUM_LIMIT')) {
                      import('react-hot-toast').then(({ default: toast }) => {
                        toast.error(e.message.split(': ')[1], { duration: 6000 });
                      });
                    } else {
                      alert("Failed to export PDF. Please try again.");
                    }
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Export as PDF
              </button>
              <button
                onClick={async () => {
                   document.getElementById("export-menu")!.style.display = "none";
                  try {
                    const { checkExportLimit } = await import('../../lib/exportLimits');
                    if (auth.currentUser) {
                      await checkExportLimit(auth.currentUser.uid);
                    }
                    const res = await fetch(`/api/export/pptx/${documentId}`);
                    if (!res.ok) throw new Error("Export failed");
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${docState?.title || 'document'}.pptx`;
                    a.click();
                    import('../../lib/analytics').then(({ track }) => {
                       track('document_exported', { document_id: documentId, format: 'pptx' });
                       track('shared_link_created', { doc_id: documentId, type: 'export', loopType: 'export-pptx' });
                    });
                    import('react-hot-toast').then(({ default: toast }) => {
                      toast.success(
                        (t) => (
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-800">Export Complete!</span>
                            <span className="text-sm text-slate-600">Loved this deck? Invite your co-founder to refine it with AI in one click.</span>
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => toast.dismiss(t.id)} className="text-xs text-slate-500 hover:text-slate-700">Dismiss</button>
                            </div>
                          </div>
                        ),
                        { duration: 6000 }
                      );
                    });
                  } catch (e: any) {
                    if (e.message?.includes('FREEMIUM_LIMIT')) {
                      import('react-hot-toast').then(({ default: toast }) => {
                        toast.error(e.message.split(': ')[1], { duration: 6000 });
                      });
                    } else {
                      alert("Failed to export PPTX. Please try again.");
                    }
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Export as PPTX
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <SectionNavigator />
        <DocumentCanvas />
        <AIChatRail />
      </div>
    </div>
  );
};
