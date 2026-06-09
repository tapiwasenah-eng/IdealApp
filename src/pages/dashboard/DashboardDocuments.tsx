import React, { useEffect } from 'react';
import { useDocumentStore } from '../../lib/store/useDocumentStore';
import { designSystem } from '../../lib/design-system';
import { FileText, Clock, Plus, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardDocuments: React.FC = () => {
  const { documents, loadAllDocuments } = useDocumentStore();
  const { colors, typography, shadows } = designSystem;
  const navigate = useNavigate();

  useEffect(() => {
    loadAllDocuments();
  }, [loadAllDocuments]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h3.fontSize, color: colors.primary.obsidian }}>
            Your Documents
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage and edit your pitch collateral and company materials.</p>
        </div>
        
        <button 
          onClick={() => navigate('/templates')}
          style={{
            background: colors.primary.spaceIndigo,
            color: 'white',
            padding: '10px 18px',
            borderRadius: designSystem.radii.buttonPrimary,
            fontFamily: typography.fonts.interface,
            fontWeight: 600,
            fontSize: typography.scale.bodyS.fontSize,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: shadows.e1,
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Create Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map(doc => (
          <div 
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col transition-all hover:border-indigo-300 hover:shadow-md group"
            style={{ boxShadow: shadows.e1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md uppercase tracking-wider">
                {doc.type}
              </span>
            </div>
            
            <h3 
              style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h4.fontSize, color: colors.primary.obsidian }}
              className="mb-1 truncate"
            >
              {doc.title}
            </h3>
            <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
              <Clock size={14} />
              Recently Edited
            </p>

            <button
              onClick={() => navigate(`/documents/${doc.id}`)}
              className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              Open Editor
              <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">No documents yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">Create your first pitch deck, operational memo, or investor update.</p>
            <button 
              onClick={() => navigate('/templates')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
            >
              Browse Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
