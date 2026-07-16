/**
 * Feature Flags — reads from session feature flags returned by /api/voice/session.
 * Falls back to env vars (VITE_FF_*) if session flags are not yet loaded.
 */

const DEFAULTS = {
  voice: true,
  transcript: true,
  llm: true,
  booking: true,
  analytics: true,
  email: true,
  rag: false,
  handoff: true,
  admin: false,
  costDisplay: false,
};

let _flags = { ...DEFAULTS };

/** Hydrate flags from server response */
export function hydrateFlags(serverFlags) {
  if (serverFlags && typeof serverFlags === 'object') {
    _flags = { ...DEFAULTS, ...serverFlags };
  }
}

/** @param {string} flag @returns {boolean} */
export function isEnabled(flag) {
  return _flags[flag] ?? DEFAULTS[flag] ?? false;
}

export const flags = new Proxy(DEFAULTS, {
  get: (_, key) => _flags[key] ?? DEFAULTS[key] ?? false,
});
