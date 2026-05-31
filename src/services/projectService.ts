import {
  collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, where, Timestamp, writeBatch, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';

export interface ProjectData {
  id?: string;
  title: string;
  workspaceId: string | null;
  templateId: string | null;
  canvasData: string;
  sections: any[];
  status: 'draft' | 'review' | 'final';
  isInDataRoom: boolean;
  thumbnail: string;
  tags: string[];
  deletedAt?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  ownerId?: string;
  collaborators?: { uid: string; role: 'editor' | 'viewer' }[];
}

const USE_LOCAL = () => {
  try {
    const u = JSON.parse(localStorage.getItem('admin_user') || '{}');
    return u?.isAdmin === true;
  } catch { return false; }
};

const LOCAL_KEY = (uid: string) => `buildit_projects_${uid}`;

function getLocalProjects(uid: string): ProjectData[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY(uid)) || '[]');
  } catch { return []; }
}
function saveLocalProjects(uid: string, projects: ProjectData[]) {
  localStorage.setItem(LOCAL_KEY(uid), JSON.stringify(projects));
}

export async function createProject(userId: string, data: Omit<ProjectData, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (USE_LOCAL()) {
    const id = nanoid();
    const projects = getLocalProjects(userId);
    const newProject: ProjectData = {
      ...data,
      id,
      ownerId: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      collaborators: [],
    };
    saveLocalProjects(userId, [...projects, newProject]);
    return id;
  }
  const ref = await addDoc(collection(db, 'users', userId, 'projects'), {
    ...data,
    ownerId: userId,
    collaborators: [],
    deletedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToProjects(userId: string, callback: (projects: ProjectData[]) => void): () => void {
  if (USE_LOCAL()) {
    callback(getLocalProjects(userId));
    return () => {};
  }
  const q = query(
    collection(db, 'users', userId, 'projects'),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProjectData));
    callback(projects);
  });
}

export async function getProject(userId: string, projectId: string): Promise<ProjectData | null> {
  if (USE_LOCAL()) {
    return getLocalProjects(userId).find(p => p.id === projectId) ?? null;
  }
  const snap = await getDoc(doc(db, 'users', userId, 'projects', projectId));
  return snap.exists() ? { id: snap.id, ...snap.data() } as ProjectData : null;
}

export async function updateProject(userId: string, projectId: string, data: Partial<ProjectData>): Promise<void> {
  if (USE_LOCAL()) {
    const projects = getLocalProjects(userId).map(p =>
      p.id === projectId ? { ...p, ...data, updatedAt: Timestamp.now() } : p
    );
    saveLocalProjects(userId, projects);
    return;
  }
  await updateDoc(doc(db, 'users', userId, 'projects', projectId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  // Soft delete
  await updateProject(userId, projectId, { deletedAt: Timestamp.now() });
}

export async function restoreFromTrash(userId: string, projectId: string): Promise<void> {
  await updateProject(userId, projectId, { deletedAt: null });
}

export async function permanentlyDelete(userId: string, projectId: string): Promise<void> {
  if (USE_LOCAL()) {
    saveLocalProjects(userId, getLocalProjects(userId).filter(p => p.id !== projectId));
    return;
  }
  await deleteDoc(doc(db, 'users', userId, 'projects', projectId));
}

export async function duplicateProject(userId: string, projectId: string): Promise<string> {
  const project = await getProject(userId, projectId);
  if (!project) throw new Error('Project not found');
  return createProject(userId, {
    ...project,
    title: `${project.title} (Copy)`,
    status: 'draft',
    isInDataRoom: false,
    deletedAt: null,
  });
}

export async function moveToWorkspace(userId: string, projectId: string, workspaceId: string | null): Promise<void> {
  await updateProject(userId, projectId, { workspaceId });
}

export async function addToDataRoom(userId: string, projectId: string): Promise<void> {
  await updateProject(userId, projectId, { isInDataRoom: true });
}

export async function removeFromDataRoom(userId: string, projectId: string): Promise<void> {
  await updateProject(userId, projectId, { isInDataRoom: false });
}
