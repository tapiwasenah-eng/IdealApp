import { doc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { apiFetch } from '../lib/api';

export interface ShareLinkConfig {
  documentIds: string[];
  password: string | null;
  expiresAt: Date | null;
  allowDownload: boolean;
  emailNotify: boolean;
  ownerId: string;
}

export async function createShareLink(userId: string, config: ShareLinkConfig): Promise<string> {
  const result = await apiFetch('/api/data-room-links', {
    method: 'POST',
    body: JSON.stringify({
      documentIds: config.documentIds,
      hasPassword: !!config.password,
      password: config.password || undefined,
      expiresAt: config.expiresAt ? config.expiresAt.toISOString() : null,
      allowDownload: config.allowDownload,
      emailNotify: config.emailNotify,
    }),
  });
  return result.token;
}

export async function validateShareLink(token: string, password?: string): Promise<any | null> {
  const q = collection(db, 'dataRoomLinks');
  // In production: query by token field with Firestore query
  // For now, the token IS the document ID for simplicity
  try {
    const snap = await getDoc(doc(db, 'dataRoomLinks', token));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
      return { expired: true };
    }
    if (data.hasPassword) {
      if (!password) return { requiresPassword: true };
      if (btoa(password) !== data.passwordHash) return { wrongPassword: true };
    }
    return {
      ...data,
      documents: [], // In production: fetch documents by IDs from data.documentIds
    };
  } catch {
    return null;
  }
}

export async function trackView(token: string, viewerInfo: Record<string, string>): Promise<void> {
  try {
    import('../lib/analytics').then(({ track }) => track('data_room_viewed', { token, viewer_info: viewerInfo }));
    await updateDoc(doc(db, 'dataRoomLinks', token), {
      viewCount: (await getDoc(doc(db, 'dataRoomLinks', token))).data()?.viewCount + 1 || 1,
      accessLog: arrayUnion({ ...viewerInfo, viewedAt: new Date().toISOString() }),
    });
  } catch (e) {
    console.error('Failed to track view:', e);
  }
}

export async function getAccessLog(userId: string, token: string): Promise<any[]> {
  try {
    const snap = await getDoc(doc(db, 'dataRoomLinks', token));
    if (!snap.exists()) return [];
    const data = snap.data();
    if (data.ownerId !== userId) return [];
    return data.accessLog ?? [];
  } catch {
    return [];
  }
}
