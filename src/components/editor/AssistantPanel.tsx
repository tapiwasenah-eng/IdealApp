import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Sparkles, Send, X, ArrowLeft, Loader2, Check } from 'lucide-react';
import { fetchWithAuth } from '../../lib/api';
import toast from 'react-hot-toast';

export const AssistantPanel: React.FC = () => {
  const { 
    sections, updateSection, setSections, 
    selectedSectionId, setRightPanelTab,
    isDirty, setDirty
  } = useEditorStore();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [scope, setScope] = useState<'section' | 'document'>('section');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1', role: 'assistant', content: 'Hi! I can help you edit this document. Select a section and tell me what you want to change, or apply edits to the whole document.'
      }]);
    }
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      if (scope === 'section' && selectedSectionId) {
        const section = sections.find(s => s.id === selectedSectionId);
        if (!section) throw new Error("No section selected");

        // Assuming endpoint exists or fallback to general document generation
        const res = await fetchWithAuth('/api/edit-section', {
          method: 'POST',
          body: JSON.stringify({
            section,
            editInstruction: userMsg,
            preferredModel: 'claude' // can be dynamic
          })
        }).catch(() => {
          // If the specialized endpoint doesn't exist yet, simulate or use general
          throw new Error("Could not reach edit-section endpoint");
        });

        if (res.section) {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: 'Here is my suggested update for the section.',
            proposal: {
              before: section,
              after: res.section
            }
          }]);
        }
      } else {
        // Whole document - using generate-document with prompt
        const res = await fetchWithAuth('/api/generate-document', {
          method: 'POST',
          body: JSON.stringify({
             documentType: 'Update',
             description: userMsg,
             existingSections: sections
          })
        });
        if (res.document && res.document.sections) {
           setMessages(prev => [...prev, {
             id: Date.now().toString(),
             role: 'assistant',
             content: 'I have updated the document based on your request. Should I apply these changes?',
             proposalFull: res.document.sections
           }]);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("AI request failed");
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `Sorry, I couldn't complete that edit: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyProposal = (msgId: string, after: any, isFullDoc = false) => {
    if (isFullDoc) {
      setSections(after);
    } else {
      if (after.id) {
        updateSection(after.id, after);
      }
    }
    setDirty(true);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, applied: true } : m));
    toast.success("Changes applied");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Sparkles size={18} /> AI Assistant
        </div>
        <button onClick={() => setRightPanelTab('inspector')} className="text-slate-400 hover:text-slate-700">
          <X size={18} />
        </button>
      </div>

      <div className="p-2 border-b border-slate-200 bg-white flex justify-center shadow-sm z-10">
        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
          <button 
            onClick={() => setScope('section')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${scope === 'section' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
          >
            Selected Section
          </button>
          <button 
            onClick={() => setScope('document')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${scope === 'document' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
          >
            Whole Document
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
              {msg.content}
              
              {/* Proposal Diff UI */}
              {msg.proposal && !msg.applied && (
                 <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                   <div className="font-semibold text-slate-500 mb-1">Proposed Change:</div>
                   <div className="line-through text-red-400 mb-1">{msg.proposal.before.body?.substring(0, 80)}...</div>
                   <div className="text-emerald-600 font-medium">{msg.proposal.after.body?.substring(0, 80)}...</div>
                   <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200">
                     <button onClick={() => applyProposal(msg.id, msg.proposal.after)} className="flex-1 py-1.5 bg-indigo-600 text-white rounded-md font-medium text-center hover:bg-indigo-700">Apply</button>
                     <button className="flex-1 py-1.5 bg-slate-200 text-slate-700 rounded-md font-medium text-center hover:bg-slate-300">Discard</button>
                   </div>
                 </div>
              )}
              {msg.proposalFull && !msg.applied && (
                 <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                   <div className="font-semibold text-slate-500">Document rebuilt ({msg.proposalFull.length} sections)</div>
                   <div className="flex items-center gap-2 mt-3">
                     <button onClick={() => applyProposal(msg.id, msg.proposalFull, true)} className="flex-1 py-1.5 bg-indigo-600 text-white rounded-md font-medium text-center hover:bg-indigo-700">Apply All</button>
                   </div>
                 </div>
              )}
              {msg.applied && (
                <div className="mt-2 flex items-center gap-1 text-emerald-600 font-bold text-xs">
                  <Check size={14} /> Applied
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-indigo-600" size={16} /> <span className="text-sm font-medium">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={scope === 'section' ? (selectedSectionId ? "Edit selected section..." : "Select a section first") : "Rewrite document to be..."}
            className="w-full text-sm p-3 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[80px]"
            disabled={scope === 'section' && !selectedSectionId}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading || (scope === 'section' && !selectedSectionId)}
            className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
