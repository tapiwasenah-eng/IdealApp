import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Plus, Copy, Trash2, LayoutTemplate } from 'lucide-react';
import { nanoid } from 'nanoid';

export const SectionsPanel: React.FC = () => {
  const { sections, setSections, selectedSectionId, setSelectedSectionId, setDirty } = useEditorStore();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
    setDirty(true);
  };

  const addSection = () => {
    const newSection = {
      id: nanoid(),
      heading: 'New Section',
      body: 'Add your content here.',
      type: 'text_section'
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
    setDirty(true);
  };

  const deleteSection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSections(sections.filter(s => s.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
    setDirty(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <LayoutTemplate size={16} /> Sections
        </h3>
        <button onClick={addSection} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedSectionId === section.id 
                            ? 'bg-indigo-50 border border-indigo-200 shadow-sm' 
                            : 'hover:bg-slate-50 border border-transparent'
                        } ${snapshot.isDragging ? 'shadow-md ring-1 ring-indigo-500' : ''}`}
                      >
                        <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600">
                          <GripVertical size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${selectedSectionId === section.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {section.heading || 'Untitled Section'}
                          </p>
                          <p className="text-xs text-slate-400 truncate capitalize">{section.type}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
                          <button onClick={(e) => deleteSection(e, section.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
