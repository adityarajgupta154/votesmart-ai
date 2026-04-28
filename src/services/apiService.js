/**
 * apiService — Centralized API communication layer
 *
 * All backend communication goes through this service.
 * Provides consistent error handling, request formatting,
 * and a single place to modify API behavior.
 */

const API_BASE = '/api';

/**
 * Generic POST request to backend API
 * @param {string} endpoint - API endpoint path (e.g., '/chat')
 * @param {object} body - Request body
 * @param {object} [options] - Additional fetch options
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} On non-OK HTTP status
 */
async function post(endpoint, body, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * GET request to backend API
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<object>} Parsed JSON response
 */
async function get(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Check backend health
 * @returns {Promise<boolean>} true if backend is healthy
 */
export async function checkHealth() {
  try {
    const data = await get('/health');
    return data.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * Send chat message to AI backend
 * @param {string} message - User message text
 * @param {Array} history - Chat history array
 * @param {string} language - 'en' or 'hi'
 * @returns {Promise<{text: string, source: string}>}
 */
export async function sendChatMessage(message, history = [], language = 'en') {
  return post('/chat', { message, history, language });
}

/**
 * Check a claim/myth via AI backend
 * @param {string} claim - The claim to verify
 * @param {string} language - 'en' or 'hi'
 * @returns {Promise<{verdict: string, explanation: string, source: string, confidenceScore: number}>}
 */
export async function checkMythClaim(claim, language = 'en') {
  return post('/myth', { claim, language });
}

/**
 * Request text-to-speech audio from backend
 * @param {string} text - Text to speak
 * @param {string} language - 'en' or 'hi'
 * @param {boolean} seniorMode - Whether to use slower speech
 * @returns {Promise<{audio: string, format: string, language: string}>}
 */
export async function requestTTS(text, language = 'en', seniorMode = false) {
  return post('/speak', { text, language, seniorMode });
}
