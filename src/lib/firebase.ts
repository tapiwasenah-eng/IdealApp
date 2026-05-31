// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from '../../firebase-applet-config.json';

// Prevent re-initialization in hot-reload environments
const existingApp = getApps().find(a => a.name === '[DEFAULT]');
let app: FirebaseApp;
if (existingApp && existingApp.options.projectId === firebaseConfig.projectId) {
  app = existingApp;
} else if (existingApp) {
  // If there's an existing app with a different project ID (e.g. injected by environment),
  // we initialize a named app for our custom config.
  app = getApps().find(a => a.name === 'idealapp') || initializeApp(firebaseConfig, 'idealapp');
} else {
  app = initializeApp(firebaseConfig);
}

const auth: Auth = getAuth(app);
// Use initializeFirestore for better control and persistence
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
}, (firebaseConfig as any).firestoreDatabaseId || '(default)');
const storage: FirebaseStorage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, storage, googleProvider };
