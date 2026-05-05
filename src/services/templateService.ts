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

export interface TemplateData {
  id?: string;
  title: string;
  description: string;
  type: string;
  sectionsSchema: any[];
  defaultCanvasJSON: string;
  version: number;
  createdAt?: any;
  updatedAt?: any;
}

export const getTemplates = async (): Promise<TemplateData[]> => {
  const q = query(collection(db, 'templates'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as TemplateData));
};

export const getTemplateById = async (templateId: string): Promise<TemplateData | null> => {
  const docRef = doc(db, 'templates', templateId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as TemplateData;
};

export const createTemplate = async (data: Omit<TemplateData, 'id'>) => {
  const colRef = collection(db, 'templates');
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};
