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

const TARGET_COLLECTION = 'submissions';

// Generate a readable, unique human reference code (e.g., WP-2026-X8K2M9)
function generateSubmissionNumber(): string {
  const year = new Date().getFullYear();
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomCode = '';
  const randomBytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    randomCode += chars[randomBytes[i] % chars.length];
  }
  return `WP-${year}-${randomCode}`;
}

// Simple fast SHA-256 hash for duplicate detection and IP anonymization
function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // Enforce POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Method Not Allowed. Gebruik uitsluitend POST.',
      }),
    };
  }

  try {
    // 1. Check payload presence and size limit (max 500KB)
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Lege aanvraag ontvangen.',
        }),
      };
    }

    if (event.body.length > 512 * 1024) {
      return {
        statusCode: 413,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Inzending overschrijdt de maximale toegestane grootte.',
        }),
      };
    }

    let payload: any;
    try {
      payload = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Ongeldige JSON-payload ontvangen.',
        }),
      };
    }

    // 2. Honeypot check (anti-bot)
    if (payload._hp || payload.website_honeypot) {
      // Silently discard spam submission with 200 OK to confuse bots
      console.warn('Spam submission caught via honeypot field');
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Inzending ontvangen.',
          submissionNumber: generateSubmissionNumber(),
        }),
      };
    }

    // 3. Required fields validation
    const surveyId =
      typeof payload.surveyId === 'string' ? payload.surveyId.trim() : '';
    const surveyType =
      typeof payload.surveyType === 'string'
        ? payload.surveyType.trim()
        : typeof payload.category === 'string'
        ? payload.category.trim()
        : 'woonwensen';
    const surveyVersion =
      typeof payload.surveyVersion === 'string' && payload.surveyVersion.trim()
        ? payload.surveyVersion.trim()
        : '1.0.0';
    const surveyTitle =
      typeof payload.surveyTitle === 'string'
        ? payload.surveyTitle.trim()
        : '';
    const answers =
      payload.answers && typeof payload.answers === 'object' && !Array.isArray(payload.answers)
        ? payload.answers
        : null;

    if (!surveyId || surveyId.length > 128) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Enquête-ID ontbreekt of is ongeldig.',
        }),
      };
    }

    if (!answers || Object.keys(answers).length === 0) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Er zijn geen ingevulde antwoorden meegeleverd.',
        }),
      };
    }

    // 4. Extract & prepare submission data
    const clientSubmissionId =
      typeof payload.id === 'string' && payload.id.trim()
        ? payload.id.trim().slice(0, 100)
        : null;
    const anonymousRespondentId =
      typeof payload.anonymousRespondentId === 'string' &&
      payload.anonymousRespondentId.trim()
        ? payload.anonymousRespondentId.trim().slice(0, 100)
        : `resp_${crypto.randomBytes(8).toString('hex')}`;
    const cbsBuurtCode =
      typeof payload.cbsBuurtCode === 'string'
        ? payload.cbsBuurtCode.trim().slice(0, 20)
        : '';
    const submittedAt =
      typeof payload.submittedAt === 'string' &&
      !isNaN(Date.parse(payload.submittedAt))
        ? new Date(payload.submittedAt).toISOString()
        : new Date().toISOString();

    // Prepare structured questions & answers list if available
    const rawResponses = Array.isArray(payload.responses)
      ? payload.responses
      : [];
    const formattedResponses = rawResponses.map((r: any) => ({
      questionId: String(r.questionId || '').slice(0, 100),
      questionTitle: String(r.questionTitle || '').slice(0, 255),
      questionType: String(r.questionType || '').slice(0, 50),
      value: r.value !== undefined ? r.value : null,
      label: r.label !== undefined ? String(r.label).slice(0, 255) : undefined,
    }));

    // Generate duplicate check fingerprint (hash of surveyId + answers)
    const duplicateHash = sha256(
      `${surveyId}:${JSON.stringify(answers)}`
    );

    // Client metadata
    const userAgent = (event.headers['user-agent'] || '').slice(0, 255);
    const clientIp =
      event.headers['x-forwarded-for'] ||
      event.headers['client-ip'] ||
      'unknown';
    const ipHash = sha256(clientIp).substring(0, 16); // Anonymized hash conforming with AVG

    // Connect to Firestore via Firebase Admin SDK
    const db = getFirebaseAdminFirestore();
    const collectionRef = db.collection(TARGET_COLLECTION);

    // 5. Duplicate submission prevention
    // Check if the same submissionId already exists
    if (clientSubmissionId) {
      const existingDoc = await collectionRef.doc(clientSubmissionId).get();
      if (existingDoc.exists) {
        const data = existingDoc.data();
        return {
          statusCode: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            id: existingDoc.id,
            submissionNumber: data?.submissionNumber || 'WP-BESTAAND',
            submittedAt: data?.submittedAt || submittedAt,
            alreadyExisted: true,
            message: 'Inzending was reeds geregistreerd.',
          }),
        };
      }
    }

    // Check recent duplicate hash within last 5 minutes to prevent rapid spam or double-clicks
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const duplicateQuery = await collectionRef
        .where('surveyId', '==', surveyId)
        .where('duplicateHash', '==', duplicateHash)
        .where('submittedAt', '>=', fiveMinutesAgo)
        .limit(1)
        .get();

      if (!duplicateQuery.empty) {
        const firstMatch = duplicateQuery.docs[0];
        const data = firstMatch.data();
        return {
          statusCode: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            id: firstMatch.id,
            submissionNumber: data?.submissionNumber || 'WP-BESTAAND',
            submittedAt: data?.submittedAt || submittedAt,
            alreadyExisted: true,
            message: 'Inzending reeds opgeslagen (dubbele klik genegeerd).',
          }),
        };
      }
    } catch (queryErr) {
      // In case compound query needs index or fails, proceed to normal write
      console.warn('Duplicate query check notice:', queryErr);
    }

    // 6. Generate unique submission number
    const uniqueSubmissionNumber = generateSubmissionNumber();

    // 7. Construct complete document matching user requirements
    const submissionDoc = {
      submissionNumber: uniqueSubmissionNumber,
      surveyId,
      surveyType,
      surveyVersion,
      surveyTitle: surveyTitle || 'Woonpanel Onderzoek',
      submittedAt,
      createdAt: FieldValue.serverTimestamp(),
      anonymousRespondentId,
      municipality: 'Dronten',
      cbsBuurtCode,
      answers,
      responses: formattedResponses,
      duplicateHash,
      metadata: {
        userAgent,
        ipHash,
        source: 'woonpanel.com',
        env: process.env.NODE_ENV || 'production',
        processedVia: 'Netlify Function (Firebase Admin SDK)',
      },
      status: 'submitted',
    };

    // Store in Firestore using clientSubmissionId if provided, or generated doc ID
    const targetDocRef = clientSubmissionId
      ? collectionRef.doc(clientSubmissionId)
      : collectionRef.doc();

    await targetDocRef.set(submissionDoc);

    console.log(
      `Inzending succesvol opgeslagen in Firestore: ID=${targetDocRef.id}, Nummer=${uniqueSubmissionNumber}`
    );

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        id: targetDocRef.id,
        submissionNumber: uniqueSubmissionNumber,
        submittedAt,
        message: 'Enquête succesvol opgeslagen in Firestore.',
      }),
    };
  } catch (err: any) {
    console.error('Error handling survey submission in Netlify Function:', err);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error:
          'Er is een serverfout opgetreden bij het opslaan van de enquête.',
        details:
          process.env.NODE_ENV === 'development' ? err?.message : undefined,
      }),
    };
  }
};
