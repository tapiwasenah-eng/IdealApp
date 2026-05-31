import React, { useState, useEffect } from "react";
import { DataRoomFolderTree } from "./DataRoomFolderTree";
import { DataRoomDocumentsGrid } from "./DataRoomDocumentsGrid";
import { DataRoomShareLinkBuilder } from "./DataRoomShareLinkBuilder";
import { DataRoomAISummaryPanel } from "./DataRoomAISummaryPanel";
import { DataRoomDocument, useDataRoomStore } from "../../../lib/store/useDataRoomStore";

export const DataRoomPage: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDocForSummary, setSelectedDocForSummary] =
    useState<DataRoomDocument | null>(null);
  const { loadDataRoom } = useDataRoomStore();

  useEffect(() => {
    loadDataRoom();
  }, [loadDataRoom]);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      <DataRoomFolderTree />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DataRoomDocumentsGrid
          onShareClick={() => setIsShareModalOpen(true)}
          onViewSummary={(doc) => setSelectedDocForSummary(doc)}
        />
      </div>

      <DataRoomAISummaryPanel
        document={selectedDocForSummary}
        onClose={() => setSelectedDocForSummary(null)}
      />

      <DataRoomShareLinkBuilder
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
