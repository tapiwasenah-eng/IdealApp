import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, MoreVertical, ExternalLink } from 'lucide-react';
import { cn, formatDate } from '@/src/lib/utils';

interface DocumentGridProps {
  documents: any[];
  loading: boolean;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card h-48 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="card p-12 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-text-secondary">
          <FileText size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">No documents yet</h3>
          <p className="text-text-secondary">Create your first workspace to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="card group hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => navigate(`/editor/${doc.id}`)}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <FileText size={20} />
              </div>
              <button className="p-1 text-text-secondary hover:bg-surface rounded-md">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">{doc.title}</h3>
            <p className="text-xs text-text-secondary flex items-center gap-1 mb-4">
              <Clock size={12} />
              Updated {formatDate(doc.updatedAt)}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                doc.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                doc.status === 'draft' ? "bg-orange-100 text-orange-700" :
                "bg-blue-100 text-blue-700"
              )}>
                {doc.status}
              </span>
              
              <div className="flex items-center gap-1 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Open Editor
                <ExternalLink size={14} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
