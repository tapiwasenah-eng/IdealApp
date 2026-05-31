import React from "react";
import { useDataRoomStore } from "../../../lib/store/useDataRoomStore";
import { designSystem } from "../../../lib/design-system";
import {
  Folder,
  FolderOpen,
  MonitorPlay,
  LineChart,
  Scale,
  Box,
  TrendingUp,
  Users,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  MonitorPlay: <MonitorPlay size={16} />,
  LineChart: <LineChart size={16} />,
  Scale: <Scale size={16} />,
  Box: <Box size={16} />,
  TrendingUp: <TrendingUp size={16} />,
  Users: <Users size={16} />,
};

export const DataRoomFolderTree: React.FC = () => {
  const { folders, documents, selectedFolderId, setSelectedFolder } =
    useDataRoomStore();
  const { colors, typography } = designSystem;

  return (
    <div
      className="w-[280px] h-full flex-shrink-0 border-r bg-slate-50 overflow-y-auto"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="p-5 border-b border-slate-100 bg-white">
        <h3
          style={{
            fontFamily: typography.fonts.interface,
            fontWeight: 600,
            fontSize: typography.scale.bodyM.fontSize,
            color: colors.primary.obsidian,
          }}
        >
          Data Room
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Organize documents for investors
        </p>
      </div>

      <div className="p-3 space-y-1">
        <button
          onClick={() => setSelectedFolder(null)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedFolderId === null ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-100"}`}
        >
          <div className="flex items-center gap-2">
            <Folder size={16} /> {/* Generic icon for All */}
            <span>All Documents</span>
          </div>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-600">
            {documents.length}
          </span>
        </button>

        <div className="pt-4 pb-1 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Folders
        </div>

        {folders.map((folder) => {
          const count = documents.filter(
            (d) => d.folderId === folder.id,
          ).length;
          const isSelected = selectedFolderId === folder.id;

          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isSelected ? "bg-white shadow-sm border border-slate-200 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-100 border border-transparent"}`}
            >
              <div className="flex items-center gap-2">
                {isSelected ? (
                  <FolderOpen size={16} className="text-indigo-500" />
                ) : (
                  iconMap[folder.iconName] || <Folder size={16} />
                )}
                <span>{folder.name}</span>
              </div>
              {count > 0 && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${isSelected ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
