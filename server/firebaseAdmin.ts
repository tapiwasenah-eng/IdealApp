import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

let app: admin.app.App | null = null;

export function getAdminApp() {
  if (app) return app;

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      let rawKey = process.env.FIREBASE_PRIVATE_KEY;
      if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
        rawKey = rawKey.substring(1, rawKey.length - 1);
      }
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: rawKey.replace(/\\n/g, '\n'),
        }),
      });
      return app;
    } catch (err) {
      console.error('Failed to initialize Firebase Admin cert:', err);
    }
  }

  // Option A: Use GOOGLE_APPLICATION_CREDENTIALS on server
  // Option B: Use a JSON string env var FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON
  const json = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const serviceAccount = JSON.parse(json);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      return app;
    } catch (err) {
      console.error('Failed to initialize Firebase Admin from JSON:', err);
    }
  }

  // Fallback: application default credentials
  try {
    let projectId = process.env.FIREBASE_PROJECT_ID;
    
    // Attempt to read from firebase-applet-config.json first if not explicitly set
    if (!projectId) {
      try {
        const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          projectId = config.projectId;
        }
      } catch (e) {
        console.warn('Could not read firebase-applet-config.json for projectId');
      }
    }

    // Finally fallback to environment vars
    if (!projectId) {
      projectId = process.env.GOOGLE_CLOUD_PROJECT;
    }

    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      ...(projectId ? { projectId } : {}),
    });
  } catch (err) {
    console.error('Failed to initialize Firebase via applicationDefault:', err);
  }

  return app;
}

export function getDb() {
  const app = getAdminApp();
  let databaseId: string | undefined;

  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      databaseId = config.firestoreDatabaseId;
    }
  } catch (e) {
    console.warn('Could not read firebase-applet-config.json for databaseId');
  }

  if (databaseId && databaseId !== "(default)") {
    return getFirestore(app === null ? undefined : app, databaseId);
  }

  return admin.firestore();
}

export async function verifyFirebaseIdToken(idToken: string) {
  getAdminApp();
  return admin.auth().verifyIdToken(idToken);
}
