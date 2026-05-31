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
  MoreHorizontal,
  Link as LinkIcon,
  Share,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Investor-Ready":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Draft":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between z-10 flex-shrink-0">
        <div>
          <h1
            style={{
              fontFamily: typography.fonts.interface,
              fontWeight: 600,
              fontSize: typography.scale.h3.fontSize,
              color: colors.primary.obsidian,
            }}
          >
            {currentFolder ? currentFolder.name : "All Documents"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {filteredDocs.length} documents
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={onShareClick}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold text-sm shadow-sm hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100"
          >
            <Share size={16} /> Share Folder
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2">
            <Plus size={16} /> Upload
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFF]">
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 font-sans">
              No documents yet
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Upload pitch materials, financials, and legal docs to this folder
              to start sharing with investors.
            </p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus size={16} /> Upload Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col"
                style={{ boxShadow: shadows.e1 }}
              >
                {/* Document Preview Placeholder */}
                <div className="h-40 bg-slate-50 border-b border-slate-100 p-4 relative overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50/30 transition-colors">
                  <FileText
                    size={48}
                    className="text-slate-300 group-hover:text-indigo-200 transition-colors"
                  />

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button
                      onClick={() => onViewSummary(doc)}
                      className="px-3 py-1.5 bg-white text-slate-900 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
                    >
                      <Sparkles size={14} className="text-indigo-600" /> AI
                      Brief
                    </button>
                  </div>
                </div>

                {/* Document Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold font-sans text-slate-900 text-[15px] leading-tight group-hover:text-indigo-700 transition-colors truncate pr-2">
                        {doc.name}
                      </h4>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-3">
                      {doc.type}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getStatusColor(doc.status)}`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  {/* Footer Analytics */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Eye size={14} className="text-slate-400" /> {doc.views}{" "}
                      views
                    </span>
                    <span>Updated {doc.updatedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
