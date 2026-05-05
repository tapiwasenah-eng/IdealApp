import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { useStore } from '../store';
import { aiService } from './aiService';

export interface DocumentRecord {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'generating' | 'complete' | 'error' | 'in_progress' | 'completed';
  ownerId: string;
  collaborators: string[];
  canvasJSON: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  workspaceId: string | null;
  templateId?: string;
}

export interface WorkspaceRecord {
  id: string;
  name: string;
  color: string;
  ownerId: string;
  members: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

function docToRecord(snapshot: DocumentData, id: string): DocumentRecord {
  const d = snapshot;
  return {
    id,
    title: d.title ?? 'Untitled',
    type: d.type ?? 'pitch-deck',
    status: d.status ?? 'draft',
    ownerId: d.ownerId ?? '',
    collaborators: d.collaborators ?? [],
    canvasJSON: d.canvasJSON ?? null,
    createdAt: d.createdAt?.toDate?.() ?? null,
    updatedAt: d.updatedAt?.toDate?.() ?? null,
    workspaceId: d.workspaceId ?? null,
    templateId: d.templateId,
  };
}

function workspaceToRecord(snapshot: DocumentData, id: string): WorkspaceRecord {
  const d = snapshot;
  return {
    id,
    name: d.name ?? 'Untitled Workspace',
    color: d.color ?? '#6366f1',
    ownerId: d.ownerId ?? '',
    members: d.members ?? [],
    createdAt: d.createdAt?.toDate?.() ?? null,
    updatedAt: d.updatedAt?.toDate?.() ?? null,
  };
}

export async function createDocument(params: {
  title: string;
  type: string;
  userId: string;
  workspaceId?: string;
  templateId?: string;
  canvasJSON?: string;
  content?: any;
  status?: 'draft' | 'generating' | 'complete' | 'error' | 'in_progress' | 'completed';
}): Promise<DocumentRecord> {
  const path = 'documents';
  try {
    const ref = await addDoc(collection(db, path), {
      title: params.title,
      type: params.type,
      status: params.status ?? 'draft',
      ownerId: params.userId,
      collaborators: [],
      canvasJSON: params.canvasJSON ?? null,
      content: params.content ?? null,
      workspaceId: params.workspaceId ?? null,
      templateId: params.templateId ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return docToRecord(snap.data()!, ref.id);
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getDocument(id: string): Promise<DocumentRecord | null> {
  const path = `documents/${id}`;
  try {
    const snap = await getDoc(doc(db, 'documents', id));
    if (!snap.exists()) return null;
    return docToRecord(snap.data(), snap.id);
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateDocument(
  id: string,
  data: Partial<Omit<DocumentRecord, 'id' | 'createdAt' | 'ownerId'>>
): Promise<void> {
  const path = `documents/${id}`;
  try {
    await updateDoc(doc(db, 'documents', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const path = `documents/${id}`;
  try {
    await deleteDoc(doc(db, 'documents', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserDocuments(
  userId: string,
  callback: (docs: DocumentRecord[]) => void
): Unsubscribe {
  const path = 'documents';
  const q = query(
    collection(db, path),
    where('ownerId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot: QuerySnapshot) => {
    const records = snapshot.docs.map((d) => docToRecord(d.data(), d.id));
    callback(records);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function duplicateDocument(id: string): Promise<DocumentRecord> {
  const source = await getDocument(id);
  if (!source) throw new Error('Source document not found');

  const { id: _, createdAt: __, updatedAt: ___, ...data } = source;
  return createDocument({
    ...data,
    userId: source.ownerId,
    title: `${source.title} (Copy)`,
  });
}

export async function createWorkspace(params: {
  name: string;
  color: string;
  userId: string;
}): Promise<WorkspaceRecord> {
  const path = 'workspaces';
  try {
    const ref = await addDoc(collection(db, path), {
      name: params.name,
      color: params.color,
      ownerId: params.userId,
      members: [params.userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return workspaceToRecord(snap.data()!, ref.id);
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getWorkspaces(userId: string): Promise<WorkspaceRecord[]> {
  const path = 'workspaces';
  try {
    const q = query(
      collection(db, path),
      where('members', 'array-contains', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => workspaceToRecord(d.data(), d.id));
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}



export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  pageCount: number;
  color: string;
  badge: string;
  rating: number;
}

export async function generateFromPrompt(prompt: string): Promise<DocumentRecord> {
  const { user } = useStore.getState();
  
  if (!user) throw new Error('User not authenticated');

  try {
    const generatedDoc = await aiService.generateFromPrompt(prompt);
  
    if (!generatedDoc) throw new Error('Generation failed');
  
    const docRecord = await createDocument({
      title: generatedDoc.title,
      type: generatedDoc.sections[0]?.type || 'pitch-deck',
      userId: user.uid,
      content: generatedDoc,
      status: 'complete',
    });

    return docRecord;
  } catch (err) {
    console.error('AI Generation Error:', err);
    throw new Error('AI generation failed. Please try again.');
  }
}

export async function getTemplates(): Promise<Template[]> {
  const res = await fetch('/api/templates');
  if (!res.ok) throw new Error('Failed to load templates');
  return res.json();
}

export const documentService = {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  subscribeToUserDocuments,
  duplicateDocument,
  createWorkspace,
  getWorkspaces,
  generateFromPrompt,
  getTemplates,
};
