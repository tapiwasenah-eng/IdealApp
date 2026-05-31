import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDataRoomStore } from "../../lib/store/useDataRoomStore";
import { designSystem } from "../../lib/design-system";
import { Download, FileText, Lock, Eye, AlertCircle } from "lucide-react";
import { auth } from "../../lib/firebase";

export const InvestorDataRoomView: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>(); // Using token as roomId
  const { documents } = useDataRoomStore(); // fallback/mock docs, replace later if needed
  const { colors, shadows } = designSystem;

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [dataRoom, setDataRoom] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "password" | "error" | "ready">("loading");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [viewedDocs, setViewedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "loading") {
      fetchAccess();
    }
  }, [roomId]);

  useEffect(() => {
    // Analytics Effect
    if (status === "ready" && selectedDocId && !viewedDocs.has(selectedDocId)) {
      setViewedDocs(prev => new Set(prev).add(selectedDocId));
      fetch(`/api/data-room-links/public/${roomId}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: selectedDocId, durationSeconds: 0 }),
      }).catch(err => console.error(err));
    }
  }, [selectedDocId, status, roomId, viewedDocs]);

  const fetchAccess = async (pw?: string) => {
    try {
      const resp = await fetch(`/api/data-room-links/public/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        if (data.requirePassword) {
          setStatus("password");
        } else {
          setErrorMsg(data.error || "Failed to load data room");
          setStatus("error");
        }
        return;
      }
      setDataRoom(data.dataRoom);
      
      if (data.dataRoom.documentIds && data.dataRoom.documentIds.length > 0) {
         setSelectedDocId(data.dataRoom.documentIds[0]);
      } else {
         setSelectedDocId("101"); // fallback for mock layout
      }
      setStatus("ready");
    } catch (e: any) {
      setErrorMsg(e.message);
      setStatus("error");
    }
  };

  if (status === "loading") {
    return <div className="h-screen w-full flex items-center justify-center">Loading Room...</div>;
  }

  if (status === "password") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow border-slate-200 max-w-sm w-full">
          <Lock className="mx-auto text-indigo-500 mb-4" size={32} />
          <h2 className="text-xl font-bold text-center mb-6">Password Required</h2>
          <form onSubmit={(e) => { e.preventDefault(); fetchAccess(password); }}>
            <input 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded p-3 mb-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800">
              Unlock Data Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-2">
        <AlertCircle className="text-red-500" size={32} />
        <h2 className="text-xl font-bold">Error</h2>
        <p className="text-slate-600">{errorMsg}</p>
      </div>
    );
  }

  const activeDocObj = documents.find((d) => d.id === selectedDocId) || { name: "Mock Document", type: "Pitch Deck" };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold font-serif text-lg shadow-sm">
            C
          </div>
          <span className="font-bold text-slate-800 tracking-tight">
            Company Data Room
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold">Live</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col pt-6 flex-shrink-0 z-10">
          <div className="px-6 mb-4">
            <h2 className="text-lg font-bold text-slate-900">Documents</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-12 mt-2">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Shared Materials</h3>
              <div className="space-y-1">
                {(dataRoom?.documentIds || []).map((id: string, idx: number) => (
                  <button
                    key={id}
                    onClick={() => setSelectedDocId(id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${selectedDocId === id ? "bg-indigo-50 border border-indigo-200" : "hover:bg-slate-50 border border-transparent"}`}
                  >
                    <FileText size={18} className={`mt-0.5 ${selectedDocId === id ? "text-indigo-600" : "text-slate-400"}`} />
                    <div>
                      <div className={`text-sm font-semibold ${selectedDocId === id ? "text-indigo-900" : "text-slate-700"}`}>
                        Document #{parseInt(id.replace(/\D/g, '')) || idx + 1}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex flex-col">
          {selectedDocId ? (
            <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="h-14 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-indigo-600" />
                  <span className="font-semibold text-slate-800 text-sm">{activeDocObj.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <Eye size={14} /> Analytics logging active
                  </span>
                  {dataRoom?.allowDownload && (
                     <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                       <Download size={18} />
                     </button>
                  )}
                </div>
              </div>
              <div className="flex-1 bg-slate-200/50 flex flex-col items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-[800px] aspect-video bg-white shadow-md rounded-lg flex flex-col items-center justify-center text-center p-12 relative overflow-hidden text-slate-400">
                  <FileText size={48} className="mb-4 opacity-50" />
                  This is the document preview pane.
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
