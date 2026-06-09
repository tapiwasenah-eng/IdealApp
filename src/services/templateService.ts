import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  runTransaction
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TemplateDoc } from '../store';

export const getTemplates = async (): Promise<TemplateDoc[]> => {
  const q = query(collection(db, 'templates'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as TemplateDoc));
};

export const getTemplateById = async (templateId: string): Promise<TemplateDoc | null> => {
  const docRef = doc(db, 'templates', templateId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as TemplateDoc;
};

export const createTemplate = async (data: Omit<TemplateDoc, 'id'>) => {
  const colRef = collection(db, 'templates');
  const docRef = await addDoc(colRef, {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
};

