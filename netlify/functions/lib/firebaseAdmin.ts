import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  App,
  Credential,
} from 'firebase-admin/app';
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  FieldValue,
} from 'firebase-admin/firestore';

// Default configuration constants for Woonpanel Dronten
export const DEFAULT_FIREBASE_PROJECT_ID = 'woonpanel-productie';
export const DEFAULT_FIRESTORE_DATABASE_ID =
  'ai-studio-woonpanelwoondat-82310a5d-1984-446d-bdb2-bdda046470e5';

let cachedDb: Firestore | null = null;
let cachedApp: App | null = null;

/**
 * Robustly cleans and formats a private key string from environment variables.
 * Handles:
 *  - Surrounding quotes ("..." or '...') often added by copy-pasting into Netlify UI
 *  - Literal escaped newlines (\n) converted to real newlines
 *  - Windows carriage returns (\r\n)
 */
function sanitizePrivateKey(rawKey: string): string {
  let key = rawKey.trim();

  // Strip wrapping double or single quotes
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Replace literal '\n' sequences with real newlines
  key = key.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');

  return key.trim();
}

/**
 * Initializes and returns the Firebase Admin App instance using Netlify Environment Variables.
 * Supports:
 *  1. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (+ optional FIREBASE_PROJECT_ID)
 *  2. FIREBASE_SERVICE_ACCOUNT (full JSON string)
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
    (process.env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID).trim();

  let credential: Credential | null = null;

  // Option 1: Individual variables (standard Netlify setup)
  if (
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    try {
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL.trim();
      const privateKey = sanitizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

      credential = cert({
        projectId,
        clientEmail,
        privateKey,
      });
    } catch (err: any) {
      console.error(
        '[FirebaseAdmin] Fout bij verwerken van FIREBASE_PRIVATE_KEY:',
        err?.message || err
      );
      throw new Error(
        `Ongeldige FIREBASE_PRIVATE_KEY indeling: ${err?.message || 'controleer begin/eind van de sleutel'}`
      );
    }
  }
  // Option 2: Full JSON string in FIREBASE_SERVICE_ACCOUNT
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = cert(sa);
    } catch (err: any) {
      console.error(
        '[FirebaseAdmin] Fout bij parsen van FIREBASE_SERVICE_ACCOUNT JSON:',
        err?.message || err
      );
      throw new Error(
        'Ongeldige FIREBASE_SERVICE_ACCOUNT JSON in omgevingsvariabelen.'
      );
    }
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
      'Firebase Admin credentials ontbreken. Controleer of FIREBASE_CLIENT_EMAIL en FIREBASE_PRIVATE_KEY zijn ingesteld in Netlify Environment Variables.'
    );
  }

  cachedApp = initializeApp({
    credential,
    projectId,
  });

  return cachedApp;
}

/**
 * Returns a singleton Firestore instance connected to the configured database.
 * Supports both named databases (e.g. ai-studio-woonpanelwoondat-82310a5d-1984-446d-bdb2-bdda046470e5)
 * and the default database ('(default)').
 *
 * Performance optimization:
 * Uses { preferRest: true } to communicate over lightweight HTTP/1.1 REST instead of
 * opening persistent gRPC streaming channels. In serverless environments, this saves ~40-60 MB
 * of memory and avoids gRPC connection handshake overhead.
 */
export function getFirebaseAdminFirestore(): Firestore {
  if (cachedDb) {
    return cachedDb;
  }

  const app = getFirebaseAdminApp();
  const rawDatabaseId = (
    process.env.FIRESTORE_DATABASE_ID || DEFAULT_FIRESTORE_DATABASE_ID
  ).trim();

  const isDefault = !rawDatabaseId || rawDatabaseId === '(default)';

  try {
    if (isDefault) {
      cachedDb = initializeFirestore(app, { preferRest: true });
    } else {
      cachedDb = initializeFirestore(app, { preferRest: true }, rawDatabaseId);
    }
  } catch {
    // If initializeFirestore was already invoked in this runtime, safely fallback to getFirestore
    cachedDb = isDefault ? getFirestore(app) : getFirestore(app, rawDatabaseId);
  }

  return cachedDb;
}

export { FieldValue };
export type { App, Firestore };
