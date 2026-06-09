// src/pages/DocumentPage.tsx

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCcw,
  Save,
  Send,
} from 'lucide-react';
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store';
import type { Section, DocumentDoc } from '../store';
import { track } from '../lib/analytics';

// Chat message type for AI Partner side rail
type ChatRole = 'user' | 'ai';

interface ChatMessage {
  role: ChatRole;
  text: string;
}

const INITIAL_AI_MESSAGE: ChatMessage = {
  role: 'ai',
  text: 'I am ready to help you draft and refine your document. Select a section and type your instructions below.',
};

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useStore((state) => state.user);

  // Workspace slice
  const workspaceDocument = useStore((state) => state.workspaceDocument);
  const workspaceSections = useStore((state) => state.workspaceSections);
  const setWorkspaceDocument = useStore((state) => state.setWorkspaceDocument);
  const setWorkspaceSections = useStore((state) => state.setWorkspaceSections);
  const updateSectionContent = useStore(
    (state) => state.updateWorkspaceSectionContent
  );
  const updateSectionAIState = useStore(
    (state) => state.updateWorkspaceSectionAIState
  );
  const normalizeSections = useStore((state) => state.normalizeSections);
  const setWorkspaceLoading = useStore((state) => state.setWorkspaceLoading);
  const setWorkspaceError = useStore((state) => state.setWorkspaceError);

  const [activeTab, setActiveTab] = useState<'document' | 'chat'>('document');
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    INITIAL_AI_MESSAGE,
  ]);
  const [chatInput, setChatInput] = useState('');

  const canvasRef = useRef<HTMLDivElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoadingLocal] = useState(true);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load document from Firestore and normalize legacy sections
  useEffect(() => {
    const loadWorkspace = async () => {
      if (!id || !user) {
        setWorkspaceError('Missing document or user context');
        setIsLoadingLocal(false);
        return;
      }

      setWorkspaceLoading(true);
      setIsLoadingLocal(true);

      try {
        const docRef = doc(db, 'users', user.uid, 'documents', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.error('Document not found');
          setWorkspaceDocument(null);
          setWorkspaceError('Document not found.');
          setIsLoadingLocal(false);
          setWorkspaceLoading(false);
          return;
        }

        const raw = docSnap.data() as any;

        // Map Firestore data into canonical DocumentDoc
        const name =
          typeof raw.name === 'string' && raw.name.trim().length > 0
            ? raw.name
            : 'Untitled Document';

        const document_type =
          typeof raw.document_type === 'string' &&
          raw.document_type.trim().length > 0
            ? raw.document_type
            : 'pitch_deck';

        const status =
          typeof raw.status === 'string' && raw.status.trim().length > 0
            ? raw.status
            : 'draft';

        const rawSections = Array.isArray(raw.sections) ? raw.sections : [];

        // Normalize legacy sections (inject ids, titles, content, ai_state)
        const normalizedSections: Section[] = normalizeSections(rawSections);

        const docData: DocumentDoc = {
          id: docSnap.id,
          name,
          document_type,
          status,
          sections: normalizedSections,
        };

        setWorkspaceDocument(docData);

        if (normalizedSections.length > 0) {
          setActiveSectionId(normalizedSections[0].id);
        } else {
          setActiveSectionId(null);
        }

        setWorkspaceError(null);
      } catch (e) {
        console.error('Failed to load document:', e);
        setWorkspaceError('Failed to load document.');
      }

      setIsLoadingLocal(false);
      setWorkspaceLoading(false);
    };

    loadWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.uid]);

  // Debounced autosave for section changes
  const debouncedSave = useCallback(
    (updatedSections: Section[], editedSectionId?: string) => {
      if (!id || !user) return;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await updateDoc(doc(db, 'users', user.uid, 'documents', id), {
            sections: updatedSections,
            updated_at: serverTimestamp(),
          });
          if (editedSectionId) {
            track('section_edited', { document_id: id, workspace_id: id, section_id: editedSectionId });
          }
        } catch (e) {
          console.error('Autosave failed', e);
        } finally {
          setIsSaving(false);
        }
      }, 1500);
    },
    [id, user]
  );

  const handleSectionContentChange = (sectionId: string, newContent: string) => {
    updateSectionContent(sectionId, newContent);
    const updated = workspaceSections.map((s) =>
      s.id === sectionId ? { ...s, content: newContent } : s
    );
    debouncedSave(updated, sectionId);
  };

  const handleRegenerate = (sectionId: string) => {
    if (!workspaceDocument) return;
    track('document_section_regenerated', {
      document_type: workspaceDocument.document_type,
    });

    updateSectionAIState(sectionId, 'generating');
    const generatingSections = workspaceSections.map((s) =>
      s.id === sectionId ? { ...s, ai_state: 'generating' as const } : s
    );
    debouncedSave(generatingSections);

    // Mock API call for now; plug in real endpoint later
    setTimeout(() => {
      updateSectionAIState(sectionId, 'generated');
      const finalSections = workspaceSections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              ai_state: 'generated' as const,
              content:
                s.content +
                '<p class="mt-4 text-electric-violet italic">✨ Refined by AI Partner</p>',
            }
          : s
      );
      debouncedSave(finalSections);
    }, 2000);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const el = document.getElementById(`section-${sectionId}`);
    if (el && canvasRef.current) {
      canvasRef.current.scrollTo({
        top: el.offsetTop - 120,
        behavior: 'smooth',
      });
    }
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
      setActiveTab('document');
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    if (!workspaceDocument) return;

    track('ai_chat_sent', { document_type: workspaceDocument.document_type });

    setChatMessages((prev) => [...prev, { role: 'user', text: chatInput }]);
    const userMessage = chatInput;
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "I've applied your instructions. Please check the active section.",
        },
      ]);
      if (activeSectionId) {
        handleRegenerate(activeSectionId);
      } else {
        console.warn('No active section selected for AI regeneration.');
      }
    }, 1500);
  };

  // Smart prompt chips based on document_type
  const promptChips =
    workspaceDocument?.document_type === 'financial_model'
      ? ['Add runway calc', 'Highlight MRR', 'Format as table']
      : workspaceDocument?.document_type === 'employee_handbook'
      ? ['Make tone warmer', 'Add compliance note', 'Expand this policy']
      : ['Make it punchier', 'Add metrics', 'Make it longer'];

  if (isLoading || isLoading === undefined) {
    return (
      <div className="flex bg-obsidian text-white h-screen items-center justify-center">
        Loading Document...
      </div>
    );
  }

  if (!workspaceDocument) {
    return (
      <div className="flex bg-obsidian text-white h-screen items-center justify-center">
        Document not found.
      </div>
    );
  }

  const hasSections =
    Array.isArray(workspaceSections) && workspaceSections.length > 0;

  return (
    <div className="flex flex-col h-screen bg-obsidian text-cosmic-white overflow-hidden">
      {/* Top Navigation */}
      <header className="h-[60px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 glass-panel border-b border-white/10 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/documents')}
            className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
              <span className="font-serif font-bold text-white text-xs">I</span>
            </div>
            <span className="font-sans font-medium hidden sm:inline">
              Docs Space
            </span>
          </button>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium px-2 py-0.5 rounded-md bg-space-indigo/20 text-electric-violet capitalize">
              {workspaceDocument.document_type.replace(/_/g, ' ')}
            </span>
            <span className="text-sm font-medium text-white/50">/</span>
            <span className="text-sm font-semibold">{workspaceDocument.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-white/40 mr-2">
            {isSaving ? (
              <RefreshCcw className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {isSaving ? 'Saving...' : 'Saved'}
          </div>
          <button className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-white text-obsidian hover:bg-gray-200 transition-colors">
            Export
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Outline Sidebar */}
        <aside
          className={`${
            showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } transition-transform duration-200 ease-out lg:static fixed inset-y-[60px] left-0 z-30 w-[260px] bg-[#050816] border-r border-white/10 flex flex-col`}
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
              Outline
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {hasSections ? (
              workspaceSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                    activeSectionId === section.id
                      ? 'bg-space-indigo/30 text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{section.title}</span>
                  {section.ai_state === 'generating' && (
                    <span className="text-[10px] text-electric-violet ml-2">
                      AI
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="text-xs text-white/40 px-2 py-4">
                No sections configured.
              </div>
            )}
          </div>
        </aside>

        {/* Document Canvas */}
        <main className="flex-1 flex flex-col bg-[#050816]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 lg:hidden">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('document');
                  setShowSidebar(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === 'document'
                    ? 'bg-white text-obsidian'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                Document
              </button>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  setShowSidebar(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === 'chat'
                    ? 'bg-white text-obsidian'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                AI Partner
              </button>
            </div>
            <button
              onClick={() => setShowSidebar((open) => !open)}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white/70"
            >
              Outline
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Document content */}
            <section
              className={`flex-1 overflow-y-auto ${
                activeTab === 'document' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div
                ref={canvasRef}
                className="max-w-4xl mx-auto py-8 px-4 sm:px-8 space-y-6"
              >
                {hasSections ? (
                  workspaceSections.map((section) => (
                    <div
                      key={section.id}
                      id={`section-${section.id}`}
                      className="bg-[#0B1120] border border-white/10 rounded-xl px-5 sm:px-6 py-5 sm:py-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-white">
                          {section.title}
                        </h2>
                        <button
                          onClick={() => handleRegenerate(section.id)}
                          className="text-[11px] text-electric-violet hover:text-electric-violet/80"
                        >
                          Regenerate
                        </button>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[160px] text-sm leading-relaxed text-white/90 focus:outline-none prose prose-invert max-w-none"
                        onInput={(e) =>
                          handleSectionContentChange(
                            section.id,
                            (e.currentTarget as HTMLDivElement).innerHTML
                          )
                        }
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-24 text-center text-white/50">
                    <p className="text-sm">
                      This document is completely empty.
                    </p>
                    <p className="text-xs mt-2">
                      Use the AI Partner to generate your first section, or add one manually.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* AI Partner Rail */}
            <aside
              className={`w-[320px] border-l border-white/10 bg-[#050816] ${
                activeTab === 'chat' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-space-indigo/30 flex items-center justify-center text-electric-violet">
                      <span className="text-xs font-semibold">AI</span>
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        AI Partner
                      </div>
                      <div className="text-[11px] text-white/50">
                        Refining: {workspaceDocument.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`text-xs leading-relaxed ${
                        msg.role === 'ai'
                          ? 'text-white/80'
                          : 'text-electric-violet'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2 overflow-x-auto no-scrollbar">
                    {promptChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => setChatInput(chip)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-white/70 hover:bg-white/10 whitespace-nowrap"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask AI to refine this section…"
                      className="flex-1 h-9 px-3 rounded-lg bg-[#020617] border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-electric-violet/60"
                    />
                    <button
                      onClick={handleSendChat}
                      className="w-9 h-9 rounded-lg bg-electric-violet flex items-center justify-center text-white hover:bg-electric-violet/90"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentPage;
