import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleFirestoreError, OperationType, auth } from './firebase';

vi.spyOn(console, 'error').mockImplementation(() => {});

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null
  })),
}));

describe('handleFirestoreError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset currentUser mock after each test
    (auth as any).currentUser = null;
  });

  it('should throw Error with empty auth info when currentUser is null', () => {
    const error = new Error('Permission denied');

    const capturedError = (() => {
      try {
        handleFirestoreError(error, OperationType.GET, 'users/1');
      } catch (e: any) {
        return e;
      }
      throw new Error('Expected handleFirestoreError to throw');
    })();

    expect(console.error).toHaveBeenCalled();

    const errInfo = JSON.parse(capturedError.message);
    expect(errInfo.error).toBe('Permission denied');
    expect(errInfo.operationType).toBe(OperationType.GET);
    expect(errInfo.path).toBe('users/1');
    expect(errInfo.authInfo.userId).toBe('');
    expect(errInfo.authInfo.email).toBe('');
    expect(errInfo.authInfo.emailVerified).toBe(false);
    expect(errInfo.authInfo.isAnonymous).toBe(false);
    expect(errInfo.authInfo.tenantId).toBe('');
    expect(errInfo.authInfo.providerInfo).toEqual([]);
  });

  it('should include correct auth context in thrown error when user is authenticated', () => {
    // Mock the currentUser object on auth
    (auth as any).currentUser = {
      uid: 'user123',
      email: 'test@example.com',
      emailVerified: true,
      isAnonymous: false,
      tenantId: 'tenant1',
      providerData: [
        {
          providerId: 'google.com',
          displayName: 'Test User',
          email: 'test@example.com',
          photoURL: 'https://example.com/photo.png'
        }
      ]
    };

    const error = new Error('Network error');

    const capturedError = (() => {
      try {
        handleFirestoreError(error, OperationType.WRITE, 'posts/1');
      } catch (e: any) {
        return e;
      }
      throw new Error('Expected handleFirestoreError to throw');
    })();

    expect(console.error).toHaveBeenCalled();

    const errInfo = JSON.parse(capturedError.message);
    expect(errInfo.error).toBe('Network error');
    expect(errInfo.operationType).toBe(OperationType.WRITE);
    expect(errInfo.path).toBe('posts/1');

    // Verify authInfo properties are correctly populated from mock currentUser
    expect(errInfo.authInfo.userId).toBe('user123');
    expect(errInfo.authInfo.email).toBe('test@example.com');
    expect(errInfo.authInfo.emailVerified).toBe(true);
    expect(errInfo.authInfo.isAnonymous).toBe(false);
    expect(errInfo.authInfo.tenantId).toBe('tenant1');
    expect(errInfo.authInfo.providerInfo).toHaveLength(1);
    expect(errInfo.authInfo.providerInfo[0]).toEqual({
      providerId: 'google.com',
      displayName: 'Test User',
      email: 'test@example.com',
      photoUrl: 'https://example.com/photo.png'
    });
  });

  it('should handle non-Error objects', () => {
    const error = 'String error message';

    const capturedError = (() => {
      try {
        handleFirestoreError(error, OperationType.DELETE, null);
      } catch (e: any) {
        return e;
      }
      throw new Error('Expected handleFirestoreError to throw');
    })();

    const errInfo = JSON.parse(capturedError.message);
    expect(errInfo.error).toBe('String error message');
    expect(errInfo.operationType).toBe(OperationType.DELETE);
    expect(errInfo.path).toBeNull();
  });

  it('should handle missing fields in providerData safely', () => {
    (auth as any).currentUser = {
      uid: 'user456',
      // Partial providerData without displayName, email, photoURL
      providerData: [
        {
          providerId: 'github.com'
        }
      ]
    };

    const error = new Error('Some error');

    const capturedError = (() => {
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'docs/1');
      } catch (e: any) {
        return e;
      }
      throw new Error('Expected handleFirestoreError to throw');
    })();

    const errInfo = JSON.parse(capturedError.message);
    expect(errInfo.authInfo.userId).toBe('user456');
    expect(errInfo.authInfo.providerInfo).toHaveLength(1);
    // Verify it defaults correctly
    expect(errInfo.authInfo.providerInfo[0]).toEqual({
      providerId: 'github.com',
      displayName: '',
      email: '',
      photoUrl: ''
    });
  });
});
