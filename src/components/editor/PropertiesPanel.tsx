import React from 'react';
import { 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Layers, 
  Settings,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  ChevronDown,
  Palette
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { cn } from '../../lib/utils';

export const PropertiesPanel: React.FC = () => {
  const selectedObjects = useEditorStore(s => s.selectedObjects);
  const canvas = useEditorStore(s => s.canvas);
  const selectedObject = selectedObjects[0];

  if (!selectedObject) {
    return (
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col p-6">
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
            <Settings className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">No Selection</h3>
            <p className="text-xs text-slate-500 mt-1">Select an object on the canvas to edit its properties.</p>
          </div>
        </div>
      </div>
    );
  }

  const type = selectedObject.type;
  const isText = type === 'text' || type === 'i-text' || type === 'textbox';

  const updateProperty = (key: string, value: any) => {
    if (!canvas || !selectedObject) return;
    selectedObject.set(key, value);
    canvas.renderAll();
    canvas.fire('object:modified', { target: selectedObject });
  };

  const deleteSelected = () => {
    if (!canvas) return;
    canvas.remove(...selectedObjects);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  return (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Properties</h3>
        <div className="flex items-center gap-1">
          <button onClick={deleteSelected} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Transform */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transform</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500">X Position</label>
              <input 
                type="number" 
                value={Math.round(selectedObject.left || 0)}
                onChange={(e) => updateProperty('left', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500">Y Position</label>
              <input 
                type="number" 
                value={Math.round(selectedObject.top || 0)}
                onChange={(e) => updateProperty('top', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appearance</h4>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500">Fill Color</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer shadow-sm"
                  style={{ backgroundColor: selectedObject.fill as string }}
                />
                <input 
                  type="text" 
                  value={selectedObject.fill as string}
                  onChange={(e) => updateProperty('fill', e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500">Opacity</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={selectedObject.opacity || 1}
                onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Text Specific */}
        {isText && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Typography</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500">Font Family</label>
                <div className="relative">
                  <select 
                    value={selectedObject.fontFamily}
                    onChange={(e) => updateProperty('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs appearance-none outline-none"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="JetBrains Mono">JetBrains Mono</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateProperty('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold')}
                  className={cn(
                    "flex-1 p-2 border rounded-lg transition-all",
                    selectedObject.fontWeight === 'bold' ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Bold className="w-4 h-4 mx-auto" />
                </button>
                <button 
                  onClick={() => updateProperty('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic')}
                  className={cn(
                    "flex-1 p-2 border rounded-lg transition-all",
                    selectedObject.fontStyle === 'italic' ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Italic className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Arrange */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrange</h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => { canvas?.bringToFront(selectedObject); canvas?.renderAll(); }}
              className="flex items-center justify-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Bring Front</span>
            </button>
            <button 
              onClick={() => { canvas?.sendToBack(selectedObject); canvas?.renderAll(); }}
              className="flex items-center justify-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <ArrowDown className="w-3 h-3" />
              <span>Send Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
