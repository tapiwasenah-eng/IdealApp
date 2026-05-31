import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';

export type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface TeamInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: MemberRole;
  status: 'pending' | 'accepted' | 'revoked';
  token: string;
  message?: string;
  createdAt: any;
  expiresAt: any;
}

export async function inviteMember(workspaceId: string, email: string, role: MemberRole, message?: string): Promise<string> {
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 7 * 86400000); // 7 days
  const ref = await addDoc(collection(db, 'invites'), {
    workspaceId,
    email,
    role,
    message: message ?? '',
    status: 'pending',
    token,
    createdAt: serverTimestamp(),
    expiresAt,
  });
  // In production: trigger Cloud Function to send invite email via SendGrid/Resend
  // The email would contain: https://app/invite/accept/{token}
  console.log(`[TeamService] Invite sent to ${email} with token ${token}`);
  return ref.id;
}

export async function acceptInvite(inviteToken: string, userId: string): Promise<boolean> {
  try {
    const q = query(collection(db, 'invites'), where('token', '==', inviteToken), where('status', '==', 'pending'));
    const snap = await getDocs(q);
    if (snap.empty) return false;
    const inviteDoc = snap.docs[0];
    const invite = inviteDoc.data() as TeamInvite;
    if (new Date() > invite.expiresAt.toDate()) return false;
    // Add user to workspace members
    await addDoc(collection(db, 'workspaces', invite.workspaceId, 'members'), {
      uid: userId,
      role: invite.role,
      joinedAt: serverTimestamp(),
    });
    // Mark invite as accepted
    await updateDoc(inviteDoc.ref, { status: 'accepted' });
    return true;
  } catch (e) {
    console.error('Failed to accept invite:', e);
    return false;
  }
}

export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  const q = query(collection(db, 'workspaces', workspaceId, 'members'), where('uid', '==', userId));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}

export async function updateMemberRole(workspaceId: string, userId: string, newRole: MemberRole): Promise<void> {
  const q = query(collection(db, 'workspaces', workspaceId, 'members'), where('uid', '==', userId));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { role: newRole })));
}

export function subscribeToTeamMembers(workspaceId: string, callback: (members: any[]) => void): () => void {
  return onSnapshot(collection(db, 'workspaces', workspaceId, 'members'), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function getPendingInvites(workspaceId: string): Promise<TeamInvite[]> {
  const q = query(collection(db, 'invites'), where('workspaceId', '==', workspaceId), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamInvite));
}

export async function revokeInvite(inviteId: string): Promise<void> {
  await updateDoc(doc(db, 'invites', inviteId), { status: 'revoked' });
}
