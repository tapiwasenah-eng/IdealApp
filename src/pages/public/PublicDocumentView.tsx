import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, FileText, Download } from 'lucide-react';
import SEOHead from '../../components/Shared/SEOHead';
import { track } from '../../lib/analytics';
import toast from 'react-hot-toast';

export default function PublicDocumentView() {
  const { id } = useParams<{ id: string }>();
  const [docData, setDocData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDoc = async () => {
      try {
        const d = await getDoc(doc(db, 'documents', id));
        if (d.exists()) {
          setDocData(d.data());
          track('investor_view_opened', { document_id: id, workspace_id: id });
        }
      } catch (err) {
        console.error("Failed to load public view", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
      </div>
    );
  }

  if (!docData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <FileText className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-xl font-bold mb-2">Document not found</h1>
        <p className="text-slate-500">This document may have been deleted or tracking link expired.</p>
        <Link to="/" className="mt-6 text-indigo-600 hover:underline">Return to IdealApp</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 pb-20">
      <SEOHead title={`${docData.name || docData.title || 'Document'} | Investor View`} description="Secure document shared via IdealApp" />
      
      {/* Top Banner - Product-Led Growth hook */}
      <div className="bg-indigo-600 text-white py-2 px-4 flex flex-col sm:flex-row items-center justify-between text-sm shadow relative z-50">
        <span>Powered by <strong>IdealApp</strong> — the fastest way to build investor-ready materials.</span>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <Link to="/templates" className="font-semibold underline hover:bg-white/10 px-2 py-1 rounded">View Templates</Link>
          <span className="text-indigo-200">|</span>
          <Link to="/auth?mode=signup&type=investor" className="font-semibold hover:bg-white/10 px-2 py-1 rounded flex items-center gap-1">
            Build your own 
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <div className="border-b border-slate-100 p-6 flex items-start justify-between bg-slate-50">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{docData.name || docData.title || 'Untitled Document'}</h1>
              <p className="text-sm text-slate-500">{docData.document_type ? docData.document_type.replace(/_/g, ' ').toUpperCase() : 'DOCUMENT'}</p>
            </div>
            
            <button 
              onClick={() => {
                track('investor_view_pdf_downloaded', { doc_id: id });
                toast.success("Downloading PDF sample...");
              }}
              className="text-sm font-medium text-slate-600 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <div className="p-8 pb-16 space-y-12">
            {(docData.sections || []).map((section: any, idx: number) => (
              <div key={section.id || idx} className="prose max-w-none prose-slate">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">{section.heading || section.title || `Section ${idx + 1}`}</h2>
                <div dangerouslySetInnerHTML={{ __html: section.content || section.body || '<p class="text-slate-400 italic">No content available</p>' }} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Deep PQL / Investor Hook */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 flex items-center justify-between">
          <div className="pr-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Want this structure for your portfolio companies?</h3>
            <p className="text-slate-600 text-sm">
              Create a free Investor account to share automated templates, data room checklists, and guided fundraising documents with all your startups.
            </p>
          </div>
          <div>
            <Link to="/auth?mode=signup&type=investor" className="whitespace-nowrap px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition">
              Create Investor Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
