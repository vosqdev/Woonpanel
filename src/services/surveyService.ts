import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SurveySubmission } from '../types/survey';
import { PanelMemberRegistration } from '../components/RegisterModal';

const SUBMISSIONS_COLLECTION = 'survey_submissions';
const PANEL_MEMBERS_COLLECTION = 'panel_members';

/**
 * Saves a survey or inquiry submission to Firebase Firestore via Netlify Functions
 * using the Firebase Admin SDK. Also handles resilience caching in localStorage.
 */
export async function saveSurveySubmission(
  submission: SurveySubmission
): Promise<{ success: boolean; id: string; submissionNumber?: string; error?: string }> {
  let submissionNumber: string | undefined = submission.submissionNumber;

  try {
    // Secure submission through Netlify serverless function
    const response = await fetch('/.netlify/functions/submit-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    if (response.ok) {
      const result = await response.json();
      submissionNumber = result.submissionNumber || submissionNumber;

      const enrichedSubmission: SurveySubmission = {
        ...submission,
        submissionNumber,
      };

      // Update local storage cache
      try {
        const stored = localStorage.getItem('woondata_cached_submissions');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(enrichedSubmission);
        localStorage.setItem(
          'woondata_cached_submissions',
          JSON.stringify(list.slice(0, 100))
        );
      } catch {
        // ignore storage errors
      }

      return {
        success: true,
        id: result.id || submission.id,
        submissionNumber,
      };
    } else {
      const errorJson = await response.json().catch(() => ({}));
      console.warn('Netlify function submission notice:', response.status, errorJson);
      throw new Error(errorJson.error || `Status code ${response.status}`);
    }
  } catch (err: any) {
    console.warn(
      'Netlify function unavailable (dev mode or offline), saving to local resilience cache:',
      err
    );

    // Generate fallback submission number if server could not be reached
    if (!submissionNumber) {
      const year = new Date().getFullYear();
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      submissionNumber = `WP-${year}-${code}`;
    }

    const fallbackSubmission: SurveySubmission = {
      ...submission,
      submissionNumber,
    };

    // Resilient local caching
    try {
      const stored = localStorage.getItem('woondata_cached_submissions');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift({ ...fallbackSubmission, pendingSync: true });
      localStorage.setItem(
        'woondata_cached_submissions',
        JSON.stringify(list.slice(0, 100))
      );
    } catch {
      // ignore
    }

    return {
      success: true,
      id: submission.id,
      submissionNumber,
      error: err?.message,
    };
  }
}

/**
 * Saves a panel member registration to Firebase Firestore via Netlify Functions.
 */
export async function savePanelMember(
  member: PanelMemberRegistration
): Promise<{ success: boolean; id: string; error?: string }> {
  try {
    const response = await fetch('/.netlify/functions/register-panel-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });

    if (response.ok) {
      const result = await response.json();

      try {
        const stored = localStorage.getItem('woondata_panel_members');
        const list = stored ? JSON.parse(stored) : [];
        const exists = list.some(
          (m: PanelMemberRegistration) =>
            m.id === member.id || m.email === member.email
        );
        if (!exists) {
          list.push(member);
          localStorage.setItem('woondata_panel_members', JSON.stringify(list));
        }
      } catch {
        // ignore
      }

      return { success: true, id: result.id || member.id };
    }
    throw new Error('Aanmelding via API mislukt');
  } catch (err: any) {
    console.warn('Panel member API notice, fallback to local storage:', err);

    try {
      const stored = localStorage.getItem('woondata_panel_members');
      const list = stored ? JSON.parse(stored) : [];
      list.push({ ...member, pendingSync: true });
      localStorage.setItem('woondata_panel_members', JSON.stringify(list));
    } catch {
      // ignore
    }

    return { success: true, id: member.id };
  }
}

/**
 * Fetch all survey submissions from Firebase Firestore.
 */
export async function fetchSubmissions(surveyId?: string): Promise<SurveySubmission[]> {
  try {
    const colRef = collection(db, SUBMISSIONS_COLLECTION);
    const q = surveyId
      ? query(colRef, where('surveyId', '==', surveyId))
      : query(colRef);
    
    const snapshot = await getDocs(q);
    const submissions: SurveySubmission[] = [];
    snapshot.forEach((d) => {
      submissions.push(d.data() as SurveySubmission);
    });
    return submissions;
  } catch (err) {
    console.warn('Could not fetch submissions from Firestore, falling back to local cache', err);
    try {
      const stored = localStorage.getItem('woondata_cached_submissions');
      if (stored) {
        const list = JSON.parse(stored);
        return surveyId ? list.filter((s: SurveySubmission) => s.surveyId === surveyId) : list;
      }
    } catch {
      // ignore
    }
    return [];
  }
}

/**
 * Fetch all panel members from Firebase Firestore.
 */
export async function fetchPanelMembers(): Promise<PanelMemberRegistration[]> {
  try {
    const colRef = collection(db, PANEL_MEMBERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const members: PanelMemberRegistration[] = [];
    snapshot.forEach((d) => {
      members.push(d.data() as PanelMemberRegistration);
    });
    return members;
  } catch (err) {
    console.warn('Could not fetch panel members from Firestore, using local cache', err);
    try {
      const stored = localStorage.getItem('woondata_panel_members');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  }
}

/**
 * Real-time listener for panel members.
 */
export function subscribeToPanelMembers(
  callback: (members: PanelMemberRegistration[]) => void
): () => void {
  try {
    const colRef = collection(db, PANEL_MEMBERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const members: PanelMemberRegistration[] = [];
        snapshot.forEach((d) => {
          members.push(d.data() as PanelMemberRegistration);
        });
        callback(members);
      },
      (error) => {
        console.warn('Panel members snapshot listener error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to set up panel members listener:', err);
    return () => {};
  }
}

/**
 * Real-time listener for survey submissions count & records.
 */
export function subscribeToSubmissions(
  callback: (submissions: SurveySubmission[]) => void
): () => void {
  try {
    const colRef = collection(db, SUBMISSIONS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const submissions: SurveySubmission[] = [];
        snapshot.forEach((d) => {
          submissions.push(d.data() as SurveySubmission);
        });
        callback(submissions);
      },
      (error) => {
        console.warn('Submissions snapshot listener error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to set up submissions listener:', err);
    return () => {};
  }
}
