/**
 * Hardened wrapper around window.localStorage to handle SecurityError
 * exceptions often thrown in restricted environments like cross-origin iframes.
 *
 * Falls back to ephemeral in-memory storage.
 */

// Ephemeral fallback memory
const ephemeralStorage = new Map<string, string>();

/**
 * Checks if localStorage is available and accessible
 */
function isLocalStorageAccessible(): boolean {
  try {
    const testKey = '__test__storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const hasLocalStorage = isLocalStorageAccessible();

export const storage = {
  getItem(key: string): string | null {
    if (hasLocalStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        // Fallback to ephemeral storage if it throws unexpectedly
        console.warn(`[storage] Failed to read ${key} from localStorage, falling back to ephemeral.`);
      }
    }
    return ephemeralStorage.get(key) || null;
  },

  setItem(key: string, value: string): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn(`[storage] Failed to write ${key} to localStorage, falling back to ephemeral.`);
      }
    }
    ephemeralStorage.set(key, value);
  },

  removeItem(key: string): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn(`[storage] Failed to remove ${key} from localStorage, falling back to ephemeral.`);
      }
    }
    ephemeralStorage.delete(key);
  },

  clear(): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.clear();
        return;
      } catch (e) {
        console.warn(`[storage] Failed to clear localStorage, falling back to ephemeral.`);
      }
    }
    ephemeralStorage.clear();
  }
};
