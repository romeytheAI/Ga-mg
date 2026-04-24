/**
 * Generates a cryptographically secure UUID v4 if available.
 * Throws an error if no secure random generation is supported.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback if randomUUID fails for some reason (e.g. non-secure context in some browsers)
    }
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  throw new Error("Secure random number generation is not supported in this environment. Cannot generate secure UUIDs.");
}

/**
 * Generates a cryptographically secure random integer between 0 (inclusive) and max (exclusive).
 * Falls back to Math.random() if crypto is unavailable.
 */
export function generateSecureRandomNumber(max: number): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return Math.floor((randomBuffer[0] / 0x100000000) * max);
  }
  throw new Error("Secure random number generation is not supported in this environment.");
}
