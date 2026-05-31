import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Read the config to get projectId
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let projectId = 'demo-project';

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  projectId = config.projectId;
}

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
    // When running in Google Cloud (like Cloud Run), it automatically uses the container's service account.
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
