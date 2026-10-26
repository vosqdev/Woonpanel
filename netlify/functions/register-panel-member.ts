import type { Handler, HandlerEvent } from '@netlify/functions';
import * as crypto from 'crypto';
import {
  getFirebaseAdminFirestore,
  FieldValue,
} from './lib/firebaseAdmin';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const TARGET_COLLECTION = 'panel_members';

// In-memory cache to instantly suppress rapid double-clicks on registration (<1ms latency)
const recentRegistrationsCache = new Map<string, { id: string; timestamp: number }>();

function cleanRecentRegistrationsCache() {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [key, value] of recentRegistrationsCache.entries()) {
    if (value.timestamp < cutoff) {
      recentRegistrationsCache.delete(key);
    }
  }
}

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Lege aanvraag ontvangen.' }),
      };
    }

    let payload: any;
    try {
      payload = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Ongeldige JSON.' }),
      };
    }

    // Honeypot check (anti-bot)
    if (payload._hp || payload.phone_check) {
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Aanmelding ontvangen.' }),
      };
    }

    const firstName = typeof payload.firstName === 'string' ? payload.firstName.trim().slice(0, 100) : '';
    const lastName = typeof payload.lastName === 'string' ? payload.lastName.trim().slice(0, 100) : '';
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase().slice(0, 200) : '';
    const privacyAgreed = payload.privacyAgreed === true;
    const newsletterOptIn = Boolean(payload.newsletterOptIn);

    if (!firstName || !lastName) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Voor- en achternaam zijn verplicht.' }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Ongeldig e-mailadres opgegeven.' }),
      };
    }

    if (!privacyAgreed) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Akkoord met het privacybeleid is verplicht.' }),
      };
    }

    // Fast in-memory deduplication check (<1ms)
    cleanRecentRegistrationsCache();
    const cached = recentRegistrationsCache.get(email);
    if (cached) {
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          id: cached.id,
          message: 'Aanmelding als panellid reeds verwerkt.',
        }),
      };
    }

    // Deterministic document ID based on hashed email ensures idempotency & prevents duplicates
    const emailHash = sha256(email).substring(0, 24);
    const memberDocId = typeof payload.id === 'string' && payload.id.trim()
      ? payload.id.trim()
      : `mbr_${emailHash}`;

    const db = getFirebaseAdminFirestore();
    const collectionRef = db.collection(TARGET_COLLECTION);

    // Save member (anonymized metadata, no sensitive IP logged)
    const memberDoc = {
      id: memberDocId,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      privacyAgreed: true,
      newsletterOptIn,
      registeredAt: new Date().toISOString(),
      createdAt: FieldValue.serverTimestamp(),
      municipality: 'Dronten',
      source: 'woonpanel.com',
      metadata: {
        userAgent: (event.headers['user-agent'] || '').slice(0, 255),
        ipHash: sha256(event.headers['x-forwarded-for'] || 'unknown').substring(0, 16),
      },
    };

    // Single atomic write with merge to prevent duplicate records
    await collectionRef.doc(memberDocId).set(memberDoc, { merge: true });

    // Cache in memory for 5 minutes
    recentRegistrationsCache.set(email, { id: memberDocId, timestamp: Date.now() });

    console.log(`[PanelMember] Aanmelding geregistreerd: ID=${memberDocId}`);

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        id: memberDocId,
        message: 'Aanmelding als panellid succesvol opgeslagen.',
      }),
    };
  } catch (err: any) {
    console.error('[PanelMember] Serverfout bij aanmelding:', err?.message || err);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Er is een serverfout opgetreden bij de aanmelding.',
      }),
    };
  }
};
