// src/lib/firebase.ts

import {
  initializeApp,
  getApps,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  type Auth,
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import {
  getAnalytics,
  type Analytics,
} from 'firebase/analytics';

import firebaseConfig from '../../firebase-applet-config.json';

// Centralized logging so we can easily swap to something like Sentry later.
function logFirebaseError(message: string, error?: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[IdealApp][Firebase] ${message}`, error);
}

function logFirebaseInfo(message: string) {
  // eslint-disable-next-line no-console
  console.info(`[IdealApp][Firebase] ${message}`);
}

export interface FirebaseServices {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
  isEmulator: boolean;
  initialized: boolean;
  fatalError: Error | null;
}

let cachedServices: FirebaseServices | null = null;

/**
 * Initialize Firebase with explicit runtime validation of env vars.
 * Adds defensive logging so Firestore connection failures do not silently hang.
 */
export function initFirebase(): FirebaseServices {
  if (cachedServices) {
    return cachedServices;
  }

  const config: Record<string, string | undefined> = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
  }

  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    const err = new Error(
      `Missing Firebase env variables: ${missingKeys.join(', ')}. ` +
        'Check your VITE_FIREBASE_* configuration.',
    );
    logFirebaseError('Firebase configuration invalid', err);

    cachedServices = {
      app: null,
      auth: null,
      db: null,
      analytics: null,
      isEmulator: false,
      initialized: false,
      fatalError: err,
    };

    return cachedServices;
  }

  let app: FirebaseApp;
  try {
    if (!getApps().length) {
      app = initializeApp(config);
      logFirebaseInfo(`Firebase app initialized for project ${config.projectId}`);
    } else {
      app = getApps()[0]!;
      logFirebaseInfo('Firebase app already initialized, reusing existing instance');
    }
  } catch (error) {
    const err = new Error('Failed to initialize Firebase app');
    logFirebaseError(err.message, error);
    cachedServices = {
      app: null,
      auth: null,
      db: null,
      analytics: null,
      isEmulator: false,
      initialized: false,
      fatalError: err,
    };
    return cachedServices;
  }

  // Derive emulator flag from env – keep it explicit for local debugging.
  const useEmulator =
    import.meta.env.MODE === 'development' &&
    import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true';

  let db: Firestore | null = null;
  let auth: Auth | null = null;
  let analytics: Analytics | null = null;
  let fatalError: Error | null = null;

  try {
    auth = getAuth(app);
  } catch (error) {
    fatalError = new Error('Failed to initialize Firebase Auth');
    logFirebaseError(fatalError.message, error);
  }

  try {
    const databaseId = firebaseConfig?.firestoreDatabaseId || '(default)';
    db = getFirestore(app, databaseId);

    if (useEmulator && db) {
      try {
        const host =
          import.meta.env.VITE_FIRESTORE_EMULATOR_HOST ?? 'localhost';
        const port = Number(
          import.meta.env.VITE_FIRESTORE_EMULATOR_PORT ?? '8080',
        );
        // This is safe to call every time in dev; it no-ops if already connected.
        connectFirestoreEmulator(db, host, port);
        logFirebaseInfo(
          `Connected Firestore emulator at ${host}:${port}`,
        );
      } catch (error) {
        logFirebaseError(
          'Failed to connect Firestore emulator, falling back to production Firestore',
          error,
        );
      }
    }
  } catch (error) {
    fatalError = fatalError ?? new Error('Failed to initialize Firestore');
    logFirebaseError(fatalError.message, error);
    db = null;
  }

  // Analytics is optional; guard for SSR / non-browser.
  if (typeof window !== 'undefined' && config.measurementId) {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      logFirebaseError('Failed to initialize Firebase Analytics', error);
      analytics = null;
    }
  }

  cachedServices = {
    app,
    auth,
    db,
    analytics,
    isEmulator: useEmulator,
    initialized: true,
    fatalError,
  };

  return cachedServices;
}

/**
 * Convenience named exports used across the app.
 * Call initFirebase() early at app bootstrap so we establish connection
 * and surface configuration issues eagerly instead of during user flows.
 */
const { app, auth, db, analytics, isEmulator, initialized, fatalError } =
  initFirebase();

export { app, auth, db, analytics, isEmulator, initialized, fatalError };
