// Data Room Provisioning & Webhook Logic

import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface ProvisionDataRoomResponse {
  dataRoomId: string;
  secureLink: string;
  investorEmail: string;
}

/**
 * Provisions a secure Data Room for an investor.
 * Maps the investor email to a unique hashed token, linking them to a specific document.
 */
export async function provisionDataRoom(investorEmail: string, documentId: string): Promise<ProvisionDataRoomResponse> {
  const token = uuidv4();
  
  // Create a record in Firestore assigning this token to the investor for this document
  const dataRoomRef = doc(db, 'documents', documentId, 'dataRooms', token);
  
  await setDoc(dataRoomRef, {
    investorEmail,
    createdAt: serverTimestamp(),
    status: 'active',
  });
  
  const secureLink = `${window.location.origin}/dataroom/${documentId}?access=${token}`;

  return {
    dataRoomId: token,
    secureLink,
    investorEmail,
  };
}

/**
 * WEBHOOK ARCHITECTURE (Zoom / Google Meet Completions)
 * 
 * 1. Webhook Reception: 
 *    - Zoom calls our deployed Cloud Function (`/api/webhooks/zoom-recording`).
 *    - The payload contains the secure download URL of the raw audio/video.
 * 
 * 2. Transcription (AssemblyAI):
 *    - The Cloud Function sends the audio download URL directly to AssemblyAI via their API.
 *    - We do NOT download the massive audio file to our server (zero-trust/lightweight).
 * 
 * 3. AssemblyAI Webhook:
 *    - AssemblyAI completes transcription and calls our second webhook (`/api/webhooks/assemblyai-complete`).
 *    - The payload contains the raw transcript JSON.
 * 
 * 4. LLM Summary (Gemini):
 *    - The script passes the raw JSON to the Gemini API (`@google/genai`) to generate a clean "Investor Call Summary" 
 *      (key objections, interests, next steps, required deck updates).
 * 
 * 5. Persistence:
 *    - We store ONLY the clean JSON and the Gemini summary into Firestore under the Investor record:
 *      `firestore.collection("investors").doc(investorId).collection("calls").add({ summary, timestamp })`
 */

/**
 * A mock trigger function simulating the ingestion of a post-call summary 
 */
export async function mockIngestCallSummary(investorId: string) {
  return {
    success: true,
    summary: {
      objections: ["Churn rate is too high in SMB segment.", "Requires more clarity on GTM strategy."],
      interests: ["Loved the AI onboarding feature.", "Impressed by enterprise pilot pipeline."],
      nextSteps: "Send updated financial model."
    }
  };
}
