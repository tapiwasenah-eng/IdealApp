import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Layout,
  FolderPlus,
  Folder,
  Edit3,
  Trash2,
  Plus,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useDocumentStore, type DocumentEntry, type Workspace } from '../../store/documentStore';
import * as localStorageService from '../../services/localStorageService';
import { useStore } from '../../store';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'blank' | 'template';

const TEMPLATE_OPTIONS = [
  { id: 'pitch-deck', name: 'Pitch Deck', icon: '📊', category: 'Business' },
  { id: 'business-plan', name: 'Business Plan', icon: '📋', category: 'Business' },
  { id: 'invoice', name: 'Invoice', icon: '🧾', category: 'Finance' },
  { id: 'resume', name: 'Resume / CV', icon: '👤', category: 'HR' },
  { id: 'proposal', name: 'Proposal', icon: '📝', category: 'Sales' },
  { id: 'report', name: 'Report', icon: '📈', category: 'Business' },
];

const WORKSPACE_COLORS = [
  '#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899',
];

export default function CreateDocumentModal({ isOpen, onClose }: CreateDocumentModalProps) {
  const navigate = useNavigate();
  const { user } = useStore();
  const {
    workspaces,
    addDocument,
    addWorkspace,
    deleteWorkspace,
    renameWorkspace,
  } = useDocumentStore();

  const [tab, setTab] = useState<Tab>('blank');
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('default');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Workspace management sub-state
  const [showNewWsForm, setShowNewWsForm] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsColor, setNewWsColor] = useState(WORKSPACE_COLORS[0]);
  const [editingWsId, setEditingWsId] = useState<string | null>(null);
  const [editingWsName, setEditingWsName] = useState('');

  // Check if user is admin (simplified for now)
  const isAdmin = false; 

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSelectedTemplate(null);
      setSelectedWorkspace('default');
      setError('');
      setTab('blank');
    }
  }, [isOpen]);

  const handleCreate = async () => {
    const finalTitle = title.trim() || (tab === 'template' && selectedTemplate
      ? TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.name ?? 'Untitled Document'
      : 'Untitled Document');

    setIsCreating(true);
    setError('');

    try {
      const newDoc: DocumentEntry = {
        id: crypto.randomUUID(),
        title: finalTitle,
        workspaceId: selectedWorkspace,
        templateId: tab === 'template' ? (selectedTemplate ?? null) : null,
        status: 'draft',
        type: tab === 'template' ? (selectedTemplate ?? 'General') : 'General',
        collaborators: [],
        canvasJSON: null,
        sections: null,
        thumbnail: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: user?.uid ?? null,
        tags: [],
      };

      // Always add to zustand store
      addDocument(newDoc);

      // Persist based on user type
      if (isAdmin || !user) {
        localStorageService.saveDocument(newDoc);
      } else {
        // Firestore save for regular authenticated users
        try {
          const { documentService } = await import('../../services/documentService');
          await documentService.createDocument({
            title: newDoc.title,
            type: newDoc.templateId || 'business-document',
            userId: user.uid,
            workspaceId: newDoc.workspaceId || undefined,
            templateId: newDoc.templateId || undefined,
            canvasJSON: newDoc.canvasJSON || undefined,
            status: 'draft'
          });
        } catch {
          // Fallback to localStorage if Firestore fails
          localStorageService.saveDocument(newDoc);
        }
      }

      onClose();
      if (tab === 'template' && selectedTemplate) {
        navigate(`/editor/${newDoc.id}?template=${selectedTemplate}`);
      } else {
        navigate(`/editor/${newDoc.id}`);
      }
    } catch (err) {
      setError('Failed to create document. Please try again.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddWorkspace = () => {
    if (!newWsName.trim()) return;
    const ws: Workspace = {
      id: crypto.randomUUID(),
      name: newWsName.trim(),
      color: newWsColor,
      createdAt: new Date().toISOString(),
      documentIds: [],
    };
    addWorkspace(ws);
    if (isAdmin || !user) {
      localStorageService.saveWorkspace(ws);
    }
    setNewWsName('');
    setShowNewWsForm(false);
    setSelectedWorkspace(ws.id);
  };

  const handleRenameWorkspace = (id: string) => {
    if (!editingWsName.trim()) return;
    renameWorkspace(id, editingWsName.trim());
    if (isAdmin || !user) {
      localStorageService.renameWorkspace(id, editingWsName.trim());
    }
    setEditingWsId(null);
    setEditingWsName('');
  };

  const handleDeleteWorkspace = (id: string) => {
    if (id === 'default') return;
    deleteWorkspace(id);
    if (isAdmin || !user) {
      localStorageService.deleteWorkspace(id);
    }
    if (selectedWorkspace === id) setSelectedWorkspace('default');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Document</h2>
              <p className="text-sm text-gray-500 mt-0.5">Start from scratch or choose a template</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-5">
              {(['blank', 'template'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === t
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t === 'blank' ? (
                    <><FileText className="w-4 h-4" /> Create Blank</>
                  ) : (
                    <><Layout className="w-4 h-4" /> From Template</>
                  )}
                </button>
              ))}
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    tab === 'template' && selectedTemplate
                      ? TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.name
                      : 'e.g. Q3 Investor Pitch'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition text-gray-900 placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>

              {/* Template Selector */}
              {tab === 'template' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a Template
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATE_OPTIONS.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                          selectedTemplate === tpl.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-100 hover:border-[#a370fc] hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{tpl.icon}</span>
                        <span className="text-xs font-medium text-gray-700 leading-tight">{tpl.name}</span>
                        {selectedTemplate === tpl.id && (
                          <Check className="w-3 h-3 text-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/templates')}
                    className="mt-3 w-full text-center text-sm text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    Browse all 180+ templates
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Workspace Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Save to Workspace</label>
                  <button
                    onClick={() => setShowNewWsForm(!showNewWsForm)}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    New workspace
                  </button>
                </div>

                {/* New workspace form */}
                <AnimatePresence>
                  {showNewWsForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 p-3 bg-indigo-100/40 rounded-xl border border-[#a370fc]/30"
                    >
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newWsName}
                          onChange={(e) => setNewWsName(e.target.value)}
                          placeholder="Workspace name"
                          className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-indigo-600 outline-none"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddWorkspace()}
                        />
                        <button
                          onClick={handleAddWorkspace}
                          disabled={!newWsName.trim()}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        {WORKSPACE_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setNewWsColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-5 h-5 rounded-full transition-all ${
                              newWsColor === c ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Workspace list */}
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {workspaces.map((ws) => (
                    <div
                      key={ws.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-all ${
                        selectedWorkspace === ws.id
                          ? 'bg-indigo-50 border border-indigo-600/30'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => setSelectedWorkspace(ws.id)}
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: ws.color }}
                      />
                      {editingWsId === ws.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editingWsName}
                          onChange={(e) => setEditingWsName(e.target.value)}
                          onBlur={() => handleRenameWorkspace(ws.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameWorkspace(ws.id);
                            if (e.key === 'Escape') { setEditingWsId(null); }
                          }}
                          className="flex-1 text-sm bg-transparent outline-none border-b border-indigo-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="flex-1 text-sm text-gray-700 font-medium">{ws.name}</span>
                      )}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingWsId(ws.id);
                            setEditingWsName(ws.name);
                          }}
                          className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        {ws.id !== 'default' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWorkspace(ws.id);
                            }}
                            className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      {selectedWorkspace === ws.id && (
                        <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || (tab === 'template' && !selectedTemplate)}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {tab === 'blank' ? 'Create Document' : 'Create from Template'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
