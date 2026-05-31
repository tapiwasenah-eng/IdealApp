import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  FileText,
  BarChart2,
  FileBarChart,
  Megaphone,
  ExternalLink,
  Copy,
  Trash2,
  Pencil,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Document } from '../../types';
import { updateDocument } from '../../services/documentService';
import toast from 'react-hot-toast';

interface DocumentCardProps {
  document: Document;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function formatRelativeTime(dateInput: string | Date | null): string {
  if (!dateInput) return 'unknown';
  const date =
    typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (diffDay >= 1) return `${diffDay}d ago`;
  if (diffHr >= 1) return `${diffHr}h ago`;
  if (diffMin >= 1) return `${diffMin}m ago`;
  return 'just now';
}

function getDocumentIconConfig(type: string): {
  bg: string;
  icon: React.ReactNode;
} {
  const t = type?.toLowerCase() || '';
  if (t.includes('pitch'))
    return {
      bg: 'bg-blue-100',
      icon: <FileText className="w-5 h-5 text-[#3B82F6]" />,
    };
  if (t.includes('business'))
    return {
      bg: 'bg-green-100',
      icon: <FileBarChart className="w-5 h-5 text-[#10B981]" />,
    };
  if (t.includes('financial'))
    return {
      bg: 'bg-purple-100',
      icon: <BarChart2 className="w-5 h-5 text-[#8B5CF6]" />,
    };
  if (t.includes('marketing'))
    return {
      bg: 'bg-orange-100',
      icon: <Megaphone className="w-5 h-5 text-[#F59E0B]" />,
    };
  return {
    bg: 'bg-blue-100',
    icon: <FileText className="w-5 h-5 text-[#3B82F6]" />,
  };
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document: doc,
  onOpen,
  onDelete,
  onDuplicate,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(doc.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);

  const { bg, icon } = getDocumentIconConfig(doc.type || '');

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Focus rename input
  useEffect(() => {
    if (isRenaming && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameSubmit = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === doc.title) {
      setIsRenaming(false);
      setRenameValue(doc.title);
      return;
    }
    try {
      await updateDocument(doc.id, { title: trimmed });
      toast.success('Document renamed');
    } catch {
      toast.error('Failed to rename document');
      setRenameValue(doc.title);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isRenaming || menuOpen) return;
    onOpen();
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 relative"
      >
        {/* Document Type Icon */}
        <div className={`${bg} rounded-xl p-2.5 flex-shrink-0`}>{icon}</div>

        {/* Title + Updated */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <input
              ref={renameRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') {
                  setRenameValue(doc.title);
                  setIsRenaming(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full font-semibold text-[#111827] border-b border-[#3B82F6] focus:outline-none bg-transparent"
            />
          ) : (
            <p className="font-semibold text-[#111827] truncate">
              {doc.title}
            </p>
          )}
          <p className="text-sm text-[#6B7280] mt-0.5">
            Updated {formatRelativeTime(doc.updatedAt)}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <Badge status={doc.status} />
        </div>

        {/* Overflow Menu */}
        <div
          ref={menuRef}
          className="flex-shrink-0 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-50 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 min-w-[148px]">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/editor/${doc.id}`);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
              >
                <ExternalLink className="w-4 h-4 text-[#6B7280]" />
                Open
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsRenaming(true);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
              >
                <Pencil className="w-4 h-4 text-[#6B7280]" />
                Rename
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDuplicate();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#111827] hover:bg-[#F9FAFB]"
              >
                <Copy className="w-4 h-4 text-[#6B7280]" />
                Duplicate
              </button>
              <div className="border-t border-[#F3F4F6] my-1" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowDeleteConfirm(true);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#111827] mb-2">
              Delete Document?
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              "{doc.title}" will be permanently deleted. This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentCard;
