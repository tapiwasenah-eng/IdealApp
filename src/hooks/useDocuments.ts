import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  subscribeToUserDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../services/documentService';
import type { DocumentRecord } from '../services/documentService';
import { useStore } from '../store';

export function useDocuments() {
  const { user, documents, setDocuments } = useStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToUserDocuments(user.uid, (docs) => {
      setDocuments(docs as any[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, setDocuments]);

  const createDoc = async (params: {
    title: string;
    type: string;
    templateId?: string;
    canvasJSON?: string;
  }): Promise<DocumentRecord | null> => {
    if (!user) {
      toast.error('You must be signed in to create a document');
      return null;
    }
    try {
      const doc = await createDocument({ ...params, userId: user.uid });
      toast.success(`"${doc.title}" created`);
      navigate(`/editor/${doc.id}`);
      return doc;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create document';
      toast.error(message);
      return null;
    }
  };

  const updateDoc = async (
    id: string,
    data: Partial<Omit<DocumentRecord, 'id' | 'createdAt' | 'ownerId'>>
  ): Promise<void> => {
    try {
      await updateDocument(id, data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update document';
      toast.error(message);
    }
  };

  const deleteDoc = async (id: string, title?: string): Promise<void> => {
    try {
      await deleteDocument(id);
      toast.success(`"${title ?? 'Document'}" deleted`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete document';
      toast.error(message);
    }
  };

  return { documents, loading, createDoc, updateDoc, deleteDoc };
}
