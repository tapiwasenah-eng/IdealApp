import React, { useEffect } from 'react';
import { useDocumentStore } from '../../lib/store/useDocumentStore';
import { designSystem } from '../../lib/design-system';
import { FileText, Clock, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardDocuments: React.FC = () => {
  const { documents, loadAllDocuments, deleteDocument } = useDocumentStore();
  const { colors, typography, shadows } = designSystem;
  const navigate = useNavigate();

  useEffect(() => {
    loadAllDocuments();
  }, [loadAllDocuments]);

  const sortedDocuments = [...documents].sort((a, b) => b.lastEditedTimestamp - a.lastEditedTimestamp);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
    }
  };

  const timeAgo = (ms: number) => {
    const diff = Date.now() - ms;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h3.fontSize, color: colors.primary.obsidian }}>
            Your Projects
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
          className="hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={16} />
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDocuments.map(doc => (
          <div 
            key={doc.id}
            onClick={() => navigate(`/documents/${doc.id}`)}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col transition-all hover:border-indigo-300 hover:shadow-md group cursor-pointer relative"
            style={{ boxShadow: shadows.e1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {doc.documentType || doc.type || 'Document'}
                </span>
                <button
                  onClick={(e) => handleDelete(e, doc.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 
              style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h4.fontSize, color: colors.primary.obsidian }}
              className="mb-1 truncate pb-1"
            >
              {doc.title || `${doc.companyName || 'Untitled'} - ${doc.documentType || 'Doc'}`}
            </h3>
            {doc.companyName && (
               <p className="text-sm font-medium text-slate-500 mb-4 truncate">{doc.companyName} {doc.industry ? `· ${doc.industry}` : ''}</p>
            )}
            {!doc.companyName && (
               <p className="text-sm font-medium text-slate-500 mb-4 h-5"></p>
            )}
            
            <p className="text-xs text-slate-400 mt-auto flex items-center gap-1.5">
              <Clock size={12} />
              Edited {timeAgo(doc.lastEditedTimestamp)}
            </p>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="col-span-full border border-slate-200 bg-white rounded-[32px] p-12 md:p-20 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
              <FileText size={32} />
            </div>
            <h3 className="font-bold text-slate-900 text-2xl mb-3 font-serif tracking-tight">Your vault is empty.</h3>
            <p className="text-slate-500 text-base max-w-md mb-8">Ambitious founders don't wait. Create your first data-driven pitch deck, operational memo, or investor update in seconds.</p>
            <button 
              onClick={() => navigate('/templates')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200 text-sm flex items-center gap-2"
            >
              <Plus size={18} />
              Start Building
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

