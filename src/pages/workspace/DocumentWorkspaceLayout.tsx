import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionNavigator } from "./SectionNavigator";
import { DocumentCanvas } from "./DocumentCanvas";
import { AIChatRail } from "./AIChatRail";
import { designSystem } from "../../lib/design-system";
import { useDocumentStore } from "../../lib/store/useDocumentStore";
import { ArrowLeft, View } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentWorkspaceLayout: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  // Do not name local variables 'document' here; use 'docState' to avoid shadowing global document object
  const { document: docState, loadDocumentById, investorView, setInvestorView, undoAction, history } =
    useDocumentStore();
  const { colors, typography, componentVariants } = designSystem;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchDoc = async () => {
      if (documentId) {
        setLoading(true);
        await loadDocumentById(documentId);
        if (mounted) setLoading(false);
      }
    };
    fetchDoc();
    setMounted(true);
    return () => { mounted = false; };
  }, [documentId, loadDocumentById]);

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

          <button className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
            Share
          </button>

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
                    const res = await fetch(`/api/export/pdf/${documentId}`);
                    if (!res.ok) throw new Error("Export failed");
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${docState?.title || 'document'}.pdf`;
                    a.click();
                  } catch (e) {
                     alert("Failed to export PDF. Please try again.");
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
                    const res = await fetch(`/api/export/pptx/${documentId}`);
                    if (!res.ok) throw new Error("Export failed");
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${docState?.title || 'document'}.pptx`;
                    a.click();
                  } catch (e) {
                     alert("Failed to export PPTX. Please try again.");
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
