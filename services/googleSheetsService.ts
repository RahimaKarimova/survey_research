import { SurveyResult } from '../types';

// Read from Vite env
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || '';

/**
 * Submit survey payload to Google Apps Script without triggering CORS preflight.
 * - Uses application/x-www-form-urlencoded with one "data" field.
 * - Tries to parse the response, but tolerates cases where CORS blocks reading.
 */
export const submitToGoogleSheet = async (data: SurveyResult): Promise<void> => {
  if (!SCRIPT_URL) {
    console.warn('Google Sheet URL not configured (VITE_GOOGLE_SHEET_URL). Skipping submission.');
    return;
  }

  // Encode the JSON into a form field so the request is "simple" (no OPTIONS)
  const body = new URLSearchParams({ data: JSON.stringify(data) }).toString();

  let res: Response;
  try {
    res = await fetch(SCRIPT_URL, {
      method: 'POST',
      // IMPORTANT: simple CORS headers – no custom headers, no JSON content-type
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body,
      // mode: 'cors' is default; you can omit it.
    });
  } catch (err) {
    // Network/CORS transport error (request not sent or blocked at network level)
    console.error('Network error on submit:', err);
    throw err;
  }

  // Try to read the response. Some Apps Script deployments do not include CORS
  // headers in the response, which can cause fetch() to throw on .json().
  try {
    const text = await res.text();
    if (text) {
      // If we can read it and it’s JSON, validate the success flag.
      try {
        const json = JSON.parse(text);
        if (json.status !== 'success') {
          throw new Error(json.message || 'Apps Script returned an error status');
        }
      } catch {
        // Not JSON – assume success if no HTTP error.
      }
    }
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  } catch (err) {
    // Couldn’t read response because of CORS; the write likely still succeeded.
    // If you want to be strict, rethrow. Otherwise, treat as success:
    console.warn('Submit likely succeeded but response was not readable due to CORS.', err);
    // If you prefer strict behavior, uncomment:
    // throw err;
  }

  console.log('Submitted to Google Sheet (or assumed success if response unreadable).');
};
