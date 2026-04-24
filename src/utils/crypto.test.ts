import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateId } from './crypto';

describe('crypto generateId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses crypto.randomUUID when available', () => {
    const mockRandomUUID = vi.fn().mockReturnValue('mocked-uuid');
    vi.stubGlobal('crypto', {
      randomUUID: mockRandomUUID,
      getRandomValues: vi.fn(),
    });

    const id = generateId();
    expect(mockRandomUUID).toHaveBeenCalled();
    expect(id).toBe('mocked-uuid');
  });

  it('falls back to crypto.getRandomValues if randomUUID is not function', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (arr: Uint8Array) => {
        arr[0] = 255; // Force highest bit to test logic
        return arr;
      }
    });

    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(id).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  });

  it('falls back to crypto.getRandomValues if randomUUID throws an error', () => {
    vi.stubGlobal('crypto', {
      randomUUID: () => { throw new Error('Not allowed in context'); },
      getRandomValues: (arr: Uint8Array) => {
        arr[0] = 0; // Force lowest bit
        return arr;
      }
    });

    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(id).toBe('00000000-0000-4000-8000-000000000000');
  });

  it('throws an error if no crypto methods are available', () => {
    vi.stubGlobal('crypto', undefined);
    expect(() => generateId()).toThrow('Secure random number generation is not supported');
  });
});
