import type { DocumentEntry, Workspace } from '../store/documentStore';

const KEYS = {
  DOCUMENTS: 'builtit_documents',
  WORKSPACES: 'builtit_workspaces',
  USER_PREFS: 'builtit_user_prefs',
} as const;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`localStorageService: failed to set ${key}`, err);
  }
}

// ─── Documents ────────────────────────────────────────────────────────────────

export function getAllDocuments(): DocumentEntry[] {
  return safeGet<DocumentEntry[]>(KEYS.DOCUMENTS, []);
}

export function getDocumentById(id: string): DocumentEntry | undefined {
  return getAllDocuments().find((d) => d.id === id);
}

export function saveDocument(doc: DocumentEntry): void {
  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) {
    docs[idx] = { ...doc, updatedAt: new Date().toISOString() };
  } else {
    docs.unshift(doc);
  }
  safeSet(KEYS.DOCUMENTS, docs);
}

export function updateDocument(
  id: string,
  updates: Partial<DocumentEntry>
): DocumentEntry | undefined {
  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === id);
  if (idx < 0) return undefined;
  docs[idx] = { ...docs[idx], ...updates, updatedAt: new Date().toISOString() };
  safeSet(KEYS.DOCUMENTS, docs);
  return docs[idx];
}

export function deleteDocument(id: string): void {
  const docs = getAllDocuments().filter((d) => d.id !== id);
  safeSet(KEYS.DOCUMENTS, docs);
}

export function duplicateDocument(id: string): DocumentEntry | undefined {
  const original = getDocumentById(id);
  if (!original) return undefined;
  const copy: DocumentEntry = {
    ...original,
    id: crypto.randomUUID(),
    title: `${original.title} (Copy)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveDocument(copy);
  return copy;
}

// ─── Workspaces ───────────────────────────────────────────────────────────────

export function getAllWorkspaces(): Workspace[] {
  const stored = safeGet<Workspace[]>(KEYS.WORKSPACES, []);
  if (stored.length === 0) {
    const defaultWs: Workspace = {
      id: 'default',
      name: 'My Documents',
      color: '#4f46e5',
      createdAt: new Date().toISOString(),
      documentIds: [],
    };
    safeSet(KEYS.WORKSPACES, [defaultWs]);
    return [defaultWs];
  }
  return stored;
}

export function saveWorkspace(workspace: Workspace): void {
  const workspaces = getAllWorkspaces();
  const idx = workspaces.findIndex((w) => w.id === workspace.id);
  if (idx >= 0) {
    workspaces[idx] = workspace;
  } else {
    workspaces.push(workspace);
  }
  safeSet(KEYS.WORKSPACES, workspaces);
}

export function deleteWorkspace(id: string): void {
  if (id === 'default') return;
  const workspaces = getAllWorkspaces().filter((w) => w.id !== id);
  safeSet(KEYS.WORKSPACES, workspaces);
}

export function renameWorkspace(id: string, name: string): void {
  const workspaces = getAllWorkspaces().map((w) =>
    w.id === id ? { ...w, name } : w
  );
  safeSet(KEYS.WORKSPACES, workspaces);
}

// ─── User Preferences ─────────────────────────────────────────────────────────

export interface UserPrefs {
  defaultWorkspaceId: string;
  lastOpenedDocumentId: string | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

const DEFAULT_PREFS: UserPrefs = {
  defaultWorkspaceId: 'default',
  lastOpenedDocumentId: null,
  theme: 'light',
  sidebarCollapsed: false,
};

export function getUserPrefs(): UserPrefs {
  return safeGet<UserPrefs>(KEYS.USER_PREFS, DEFAULT_PREFS);
}

export function saveUserPrefs(prefs: Partial<UserPrefs>): void {
  const current = getUserPrefs();
  safeSet(KEYS.USER_PREFS, { ...current, ...prefs });
}

// ─── Re-export as default object ──────────────────────────────────────────────

const localStorageService = {
  getAllDocuments,
  getDocumentById,
  saveDocument,
  updateDocument,
  deleteDocument,
  duplicateDocument,
  getAllWorkspaces,
  saveWorkspace,
  deleteWorkspace,
  renameWorkspace,
  getUserPrefs,
  saveUserPrefs,
};

export default localStorageService;
