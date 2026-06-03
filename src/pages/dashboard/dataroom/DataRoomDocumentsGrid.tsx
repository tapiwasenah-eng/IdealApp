import React from "react";
import {
  useDataRoomStore,
  DataRoomDocument,
} from "../../../lib/store/useDataRoomStore";
import { designSystem } from "../../../lib/design-system";
import {
  Search,
  Plus,
  Sparkles,
  FileText,
  Eye,
  MoreVertical,
  Share,
  Upload,
  LayoutGrid,
  List
} from "lucide-react";

interface Props {
  onShareClick: () => void;
  onViewSummary: (doc: DataRoomDocument) => void;
}

export const DataRoomDocumentsGrid: React.FC<Props> = ({
  onShareClick,
  onViewSummary,
}) => {
  const { documents, folders, selectedFolderId } = useDataRoomStore();
  const { colors, typography, shadows } = designSystem;

  const currentFolder = folders.find((f) => f.id === selectedFolderId);
  const filteredDocs = selectedFolderId
    ? documents.filter((d) => d.folderId === selectedFolderId)
    : documents;

  const getFileTypeColor = (type: string) => {
    switch(type.toUpperCase()) {
      case 'PDF': return 'text-red-500 font-serif font-bold text-xl';
      case 'XLSX': return 'text-emerald-600 font-serif font-bold text-xl';
      case 'DOCX': return 'text-blue-600 font-serif font-bold text-xl';
      case 'PPTX': return 'text-indigo-500 font-serif font-bold text-xl';
      default: return 'text-slate-600 font-serif font-bold text-xl';
    }
  };

  const getStatusPill = (status: string) => {
    // For demo purposes, we map status to SHARED or PRIVATE
    const isShared = status === 'Investor-Ready' || status === 'Shared';
    
    if (isShared) {
      return <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase">SHARED</span>;
    }
    return <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase">PRIVATE</span>;
  };

  const activeViewers = 14;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      <div className="p-6 pb-2 border-b border-slate-100 bg-white flex items-center justify-between z-10 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1 font-medium">
            <span className="flex items-center gap-1.5"><FileText size={16} /> Main Room</span>
            <span>›</span>
            <span className="text-slate-900 font-bold">{currentFolder ? currentFolder.name : "All Documents"}</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">TOTAL FILES</span>
              <span className="text-lg font-bold text-slate-700">{filteredDocs.length}</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">ACTIVE VIEWERS</span>
              <span className="text-lg font-bold text-slate-700">{activeViewers}</span>
           </div>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center justify-between bg-[#fbfcff]">
         <div className="relative w-[300px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search financials..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
             <button className="p-2 bg-slate-100 text-slate-600"><LayoutGrid size={18} /></button>
             <button className="p-2 bg-white text-slate-400 hover:text-slate-600"><List size={18} /></button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20 bg-[#fbfcff]">
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <Upload size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-sans">
              Empty Directory
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mb-6">
              Upload pitch materials, financials, and legal docs to this folder.
            </p>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Upload size={16} /> Upload New Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-[24px] border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all group flex flex-col p-6 cursor-pointer"
                style={{ boxShadow: shadows.e1 }}
              >
                <div className="flex justify-between items-start mb-10">
                   <div className={getFileTypeColor(doc.type)} style={{ letterSpacing: '-0.02em' }}>{doc.type.toUpperCase()}</div>
                   <div className="flex flex-col items-end gap-1">
                      {getStatusPill(doc.status)}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mt-1">
                         <Eye size={12} /> {doc.views.toLocaleString()}
                      </div>
                   </div>
                </div>

                <div className="mb-6">
                   <h4 className="font-bold font-sans text-slate-900 text-lg leading-tight mb-2 truncate">
                      {doc.name.replace(`.${doc.type.toLowerCase()}`, '')}
                   </h4>
                   <p className="text-sm text-slate-500 font-medium">
                      Updated {doc.updatedAt} • {(Math.random() * 20 + 1).toFixed(1)} MB
                   </p>
                </div>

                <div className="mt-auto flex items-center gap-2">
                   <button 
                      onClick={(e) => { e.stopPropagation(); onViewSummary(doc); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-600 font-bold text-[11px] uppercase tracking-wider rounded-xl transition-colors"
                   >
                     <Sparkles size={14} /> AI Summary
                   </button>
                   <button className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                      <MoreVertical size={16} />
                   </button>
                </div>
              </div>
            ))}

            {/* Upload New Asset Card */}
            <div className="rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[250px] group">
               <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload size={20} />
               </div>
               <h4 className="font-bold text-slate-800 text-[15px] mb-1">Upload New Asset</h4>
               <p className="text-slate-500 text-xs font-medium max-w-[140px]">Drag and drop or click to browse</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
