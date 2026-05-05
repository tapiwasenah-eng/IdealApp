// src/components/modals/CreateDocumentModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface CreateDocumentModalProps {
  onClose: () => void;
}

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111118] border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Create Document</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-zinc-400 text-sm mb-6">
          This modal is a placeholder. In a real app, it would allow you to start a new document from scratch or from a template.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
