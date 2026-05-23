/**
 * Module-level token store.
 * Keeps tokens in memory and syncs to localStorage so that:
 * - axios interceptors (outside React) can read them via getTokens()
 * - tokens survive page refresh via localStorage
 */

const STORAGE_KEY = 'pb_auth_tokens';

let _tokens = null;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getTokens() {
  if (_tokens) return _tokens;
  _tokens = loadFromStorage();
  return _tokens;
}

export function setTokens(tokens) {
  _tokens = tokens;
  if (tokens) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function clearTokens() {
  _tokens = null;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasTokens() {
  return !!getTokens();
}
