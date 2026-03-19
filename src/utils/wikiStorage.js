// ─── WikiMe Storage Helpers ───────────────────────────────────────────────────
const PREFIX = "wikime:";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "wikime-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Save a wiki. Pass password string or null (no password = no editing). */
export async function saveWiki(slug, data, password = null) {
  const passwordHash = password ? await hashPassword(password) : null;
  const payload = {
    ...data,
    slug,
    savedAt: new Date().toISOString(),
    passwordHash,
    hasPassword: !!password,
  };
  localStorage.setItem(PREFIX + slug, JSON.stringify(payload));
  return payload;
}

/** Load a wiki by slug. Returns the object or null. */
export function loadWiki(slug) {
  const raw = localStorage.getItem(PREFIX + slug);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Verify a password attempt against a saved wiki's hash. */
export async function verifyPassword(slug, attempt) {
  const wiki = loadWiki(slug);
  if (!wiki || !wiki.passwordHash) return false;
  const hash = await hashPassword(attempt);
  return hash === wiki.passwordHash;
}

/** Check whether a slug is already taken. */
export function slugExists(slug) {
  return localStorage.getItem(PREFIX + slug) !== null;
}

/** List all saved wikis. */
export function listWikis() {
  return Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .map((k) => {
      try {
        return JSON.parse(localStorage.getItem(k));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
