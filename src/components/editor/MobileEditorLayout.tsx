import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { SectionsPanel } from './SectionsPanel';
import { InspectorPanel } from './InspectorPanel';
import { AssistantPanel } from './AssistantPanel';
import EditorCanvas from './EditorCanvas';
import { LayoutList, Maximize, Edit3, X, Cloud, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MobileEditorLayout: React.FC<{ project: any }> = ({ project }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'preview' | 'sections' | 'edit'>('preview');
  const { setRightPanelTab, saveStatus } = useEditorStore();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-20">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
        <button onClick={() => navigate('/dashboard')} className="text-slate-500 font-bold text-sm">
          ← Back
        </button>
        <span className="font-bold text-slate-900 truncate max-w-[150px]">{project?.title}</span>
        <div className="text-slate-500 flex items-center">
          {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={16} /> : <Cloud size={16} />}
        </div>
      </header>

      {/* Main Content Area (always canvas) */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0">
          <EditorCanvas />
        </div>

        {/* Bottom Sheet for Sections */}
        {activeTab === 'sections' && (
          <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col z-30 transition-transform">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto relative bg-white">
              <SectionsPanel />
            </div>
            <button onClick={() => setActiveTab('preview')} className="absolute top-3 right-4 p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Bottom Sheet for Edit properties */}
        {activeTab === 'edit' && (
          <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col z-30 transition-transform">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-hidden relative">
               <InspectorPanel />
            </div>
            {/* Quick action button to swap to Assistant */}
            <div className="absolute top-2 right-4">
               <button onClick={() => setRightPanelTab('assistant')} className="text-indigo-600 bg-indigo-50 p-2 rounded-full">
                 <Sparkles size={18} />
               </button>
            </div>
            <button onClick={() => setActiveTab('preview')} className="absolute top-2 left-4 p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Tabs Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 pb-safe-bottom z-40">
        <div className="bg-slate-100 p-1 rounded-xl flex">
          {[
            { id: 'sections', icon: LayoutList, label: 'Sections' },
            { id: 'preview', icon: Maximize, label: 'Preview' },
            { id: 'edit', icon: Edit3, label: 'Edit' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
