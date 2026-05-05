import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { AlignLeft, Bold, Settings2, Sparkles, MessageSquare } from 'lucide-react';

export const InspectorPanel: React.FC = () => {
  const { sections, selectedSectionId, updateSection, setRightPanelTab } = useEditorStore();
  
  const section = sections.find(s => s.id === selectedSectionId);

  if (!section) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <Settings2 size={32} className="mb-2 opacity-50" />
        <p className="text-sm">Select a section on the left or an object on the canvas to inspect its properties.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Inspector</h3>
        <button 
          onClick={() => setRightPanelTab('assistant')}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Sparkles size={14} /> AI Assistant
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section Editing */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</h4>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Heading</label>
            <input 
              value={section.heading || ''}
              onChange={(e) => updateSection(section.id, { heading: e.target.value })}
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Body text</label>
            <textarea 
              value={section.body || ''}
              onChange={(e) => updateSection(section.id, { body: e.target.value })}
              rows={6}
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Quick AI Actions */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Quick Actions</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRightPanelTab('assistant')} className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 font-medium text-slate-600 transition-colors">
                Improve clarity
              </button>
              <button onClick={() => setRightPanelTab('assistant')} className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 font-medium text-slate-600 transition-colors">
                Make persuasive
              </button>
              <button onClick={() => setRightPanelTab('assistant')} className="col-span-2 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 font-medium text-slate-600 transition-colors">
                Shorten text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
