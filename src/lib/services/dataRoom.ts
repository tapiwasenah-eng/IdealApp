import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function provisionDataRoom(investorEmail: string, documentId: string): Promise<{ shareUrl: string; id: string }> {
  try {
    // Generate a secure token (using crypto.randomUUID if available, else fallback)
    const token = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    
    // Create Firestore entry for Data Room
    const docRef = await addDoc(collection(db, 'datarooms'), {
      documentId,
      investorEmail,
      token,
      createdAt: serverTimestamp(),
      status: 'active',
      views: 0
    });

    // Create a sub-collection for call summaries (can be populated later via webhooks)
    await addDoc(collection(db, 'datarooms', docRef.id, 'meetings'), {
      meetingDate: serverTimestamp(),
      status: 'pending_summary'
    });

    // Generate shareable URL
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/data-room/view/${token}`;

    return { shareUrl, id: docRef.id };
  } catch (error) {
    console.error('Error provisioning data room:', error);
    throw error;
  }
}
