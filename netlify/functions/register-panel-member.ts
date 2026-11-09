import type { Handler, HandlerEvent } from '@netlify/functions';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';
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
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@woondata.com';

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

/**
 * Sends an email notification to info@woondata.com.
 * Supports SMTP (via Netlify Environment Variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 * or Resend (via RESEND_API_KEY). Also backed by Netlify Forms.
 */
async function sendNotificationEmail(member: {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  newsletterOptIn: boolean;
  registeredAt: string;
}): Promise<{ sent: boolean; reason?: string }> {
  // 1. Direct SMTP via Netlify Environment Variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const subject = `Nieuwe aanmelding panellid: ${member.fullName}`;
      const text = `Er is een nieuwe aanmelding binnengekomen via Woonpanel.com:

Naam: ${member.fullName}
Voornaam: ${member.firstName}
Achternaam: ${member.lastName}
E-mailadres: ${member.email}
Gemeente: Dronten
Nieuwsbrief / updates: ${member.newsletterOptIn ? 'Ja' : 'Nee'}
Datum & tijd: ${new Date(member.registeredAt).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}
Referentie ID: ${member.id}
Bron: Woonpanel.com
`;

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #ffffff;">
          <div style="margin-bottom: 16px;">
            <span style="background-color: #f5f5f4; color: #171717; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; font-family: monospace; text-transform: uppercase;">Woondata Woonpanel</span>
          </div>
          <h2 style="color: #171717; margin: 0 0 8px 0; font-size: 20px;">Nieuwe aanmelding panellid</h2>
          <p style="color: #57534e; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">Er is een nieuw panellid aangemeld via het formulier op <strong>Woonpanel.com</strong>:</p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c; width: 140px;">Naam:</td>
              <td style="padding: 10px 0; color: #171717; font-weight: bold;">${member.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c;">E-mailadres:</td>
              <td style="padding: 10px 0; color: #171717; font-weight: bold;"><a href="mailto:${member.email}" style="color: #16a34a; text-decoration: none;">${member.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c;">Gemeente:</td>
              <td style="padding: 10px 0; color: #171717;">Dronten (incl. Biddinghuizen & Swifterbant)</td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c;">Updates ontvangen:</td>
              <td style="padding: 10px 0; color: #171717;">${member.newsletterOptIn ? 'Ja' : 'Nee'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c;">Datum & tijd:</td>
              <td style="padding: 10px 0; color: #171717;">${new Date(member.registeredAt).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #78716c;">Referentie ID:</td>
              <td style="padding: 10px 0; font-family: monospace; font-size: 12px; color: #78716c;">${member.id}</td>
            </tr>
          </table>

          <div style="background-color: #fafaf9; border-radius: 12px; padding: 12px 16px; font-size: 12px; color: #78716c;">
            Dit panellid is tevens veilig opgeslagen in de Firestore-database (collectie <code>panel_members</code>).
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Woondata Woonpanel" <${smtpUser}>`,
        to: NOTIFICATION_EMAIL,
        subject,
        text,
        html,
      });

      console.log(`[PanelMember] E-mail notificatie succesvol verzonden naar ${NOTIFICATION_EMAIL}`);
      return { sent: true };
    } catch (err: any) {
      console.error('[PanelMember] Fout bij verzenden via SMTP:', err?.message || err);
      return { sent: false, reason: err?.message };
    }
  }

  // 2. Resend API support (indien RESEND_API_KEY is ingesteld)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Woonpanel <onboarding@resend.dev>',
          to: NOTIFICATION_EMAIL,
          subject: `Nieuwe aanmelding panellid: ${member.fullName}`,
          html: `<p>Nieuwe aanmelding panellid via Woonpanel.com:</p><p><strong>Naam:</strong> ${member.fullName}<br/><strong>E-mail:</strong> ${member.email}<br/><strong>Gemeente:</strong> Dronten<br/><strong>Nieuwsbrief:</strong> ${member.newsletterOptIn ? 'Ja' : 'Nee'}</p>`,
        }),
      });
      if (res.ok) {
        console.log(`[PanelMember] E-mail succesvol verzonden via Resend naar ${NOTIFICATION_EMAIL}`);
        return { sent: true };
      }
    } catch (e: any) {
      console.error('[PanelMember] Fout bij verzenden via Resend:', e?.message || e);
    }
  }

  return { sent: false, reason: 'Geen directe SMTP ingesteld; notificatie verloopt via Netlify Forms' };
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

    console.log(`[PanelMember] Aanmelding geregistreerd in Firestore: ID=${memberDocId}`);

    // Stuur e-mailnotificatie naar info@woondata.com (indien SMTP of Resend ingesteld)
    let emailStatus: { sent: boolean; reason?: string } = { sent: false, reason: 'Niet verzonden' };
    try {
      emailStatus = await sendNotificationEmail(memberDoc);
    } catch (emailErr: any) {
      console.warn('[PanelMember] E-mailnotificatie kon niet direct worden verzonden:', emailErr?.message || emailErr);
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        id: memberDocId,
        message: 'Aanmelding als panellid succesvol opgeslagen.',
        emailNotification: emailStatus.sent ? 'Verzonden naar info@woondata.com' : 'Geregistreerd voor Netlify Forms notificatie',
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
