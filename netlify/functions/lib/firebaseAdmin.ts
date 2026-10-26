import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  App,
  Credential,
} from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';

// Default configuration constants for Woonpanel Dronten
export const DEFAULT_FIREBASE_PROJECT_ID = 'woonpanel-productie';
export const DEFAULT_FIRESTORE_DATABASE_ID =
  'ai-studio-woonpanelwoondat-82310a5d-1984-446d-bdb2-bdda046470e5';

let cachedDb: Firestore | null = null;
let cachedApp: App | null = null;

/**
 * Initializes and returns the Firebase Admin App instance using Netlify Environment Variables.
 * Supports either:
 *  1. FIREBASE_SERVICE_ACCOUNT (full JSON string)
 *  2. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (+ optional FIREBASE_PROJECT_ID)
 *  3. Application Default Credentials (GCP environment)
 */
export function getFirebaseAdminApp(): App {
  if (cachedApp) {
    return cachedApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;

  let credential: Credential | null = null;

  // Option 1: Full JSON string in FIREBASE_SERVICE_ACCOUNT
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = cert(sa);
    } catch (err: any) {
      console.error(
        'Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:',
        err?.message || err
      );
      throw new Error(
        'Ongeldige FIREBASE_SERVICE_ACCOUNT JSON in omgevingsvariabelen.'
      );
    }
  }
  // Option 2: Individual variables
  else if (
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    // Replace escaped newlines if passed as single-line string with '\n'
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    credential = cert({
      projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
      privateKey: privateKey,
    });
  } else {
    // Option 3: Fallback to application default credentials (if available in cloud)
    try {
      credential = applicationDefault();
    } catch {
      credential = null;
    }
  }

  if (!credential) {
    throw new Error(
      'Firebase Admin credentials ontbreken. Stel FIREBASE_SERVICE_ACCOUNT of FIREBASE_CLIENT_EMAIL en FIREBASE_PRIVATE_KEY in in Netlify Environment Variables.'
    );
  }

  cachedApp = initializeApp({
    credential,
    projectId,
  });

  return cachedApp;
}

/**
 * Returns a Firestore instance connected to the dedicated database
 * 'ai-studio-woonpanelwoondat-82310a5d-1984-446d-bdb2-bdda046470e5'.
 */
export function getFirebaseAdminFirestore(): Firestore {
  if (cachedDb) {
    return cachedDb;
  }

  const app = getFirebaseAdminApp();
  const databaseId =
    process.env.FIRESTORE_DATABASE_ID || DEFAULT_FIRESTORE_DATABASE_ID;

  // Connect to the specific named Firestore database
  cachedDb = getFirestore(app, databaseId);
  return cachedDb;
}

export { FieldValue };
export type { App, Firestore };
