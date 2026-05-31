import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { createWorkspace } from '../../services/documentService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EF4444', // red
  '#EC4899', // pink
];

interface WorkspaceNavProps {
  collapsed?: boolean;
}

export const WorkspaceNav: React.FC<WorkspaceNavProps> = ({
  collapsed = false,
}) => {
  const { user } = useAuth();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } =
    useWorkspaceStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      toast.error('Workspace name is required');
      return;
    }
    setCreating(true);
    try {
      const ws = await createWorkspace({
        name,
        color: newColor,
        userId: user!.uid,
      });
      setActiveWorkspace(ws.id);
      toast.success(`Workspace "${name}" created`);
      setShowCreateModal(false);
      setNewName('');
      setNewColor(PRESET_COLORS[0]);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  if (collapsed) return null;

  return (
    <>
      <div className="px-3 mt-2">
        {/* Section Header */}
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Workspaces
          </span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
            title="New workspace"
          >
            <Plus className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
        </div>

        {/* Workspace List */}
        <div className="space-y-0.5">
          {workspaces.length === 0 && (
            <p className="text-xs text-[#9CA3AF] px-2 py-1">
              No workspaces yet
            </p>
          )}
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspaceId;
            return (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspace(ws.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] font-medium'
                    : 'text-[#374151] hover:bg-[#F9FAFB]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: ws.color || '#3B82F6' }}
                />
                <span className="truncate">{ws.name}</span>
                {isActive && (
                  <Check className="w-3 h-3 ml-auto flex-shrink-0 text-[#1D4ED8]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#111827] mb-4">
              New Workspace
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Q2 Fundraise"
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  required
                  autoFocus
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newColor === color
                          ? 'scale-125 ring-2 ring-offset-2 ring-[#3B82F6]'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-lg px-3 py-2 border border-[#E5E7EB]">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: newColor }}
                />
                <span className="text-sm text-[#374151]">
                  {newName || 'My Workspace'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceNav;
