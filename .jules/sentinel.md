## 2025-04-17 - Secure Random Fallbacks and Target Blank Attributes
**Vulnerability:** Weak pseudo-random number generation fallback for UUIDs and potential reverse tabnabbing via target blank without rel noopener.
**Learning:** In frontend web environments, it is common to miss the crypto.getRandomValues API when polyfilling or falling back from crypto.randomUUID. Always check for both.
**Prevention:** Use eslint-plugin-react rules to enforce rel noopener noreferrer on external links. Standardize crypto utilities to prefer Web Crypto API methods before ever relying on Math.random.

## 2025-04-23 - Hardcoded Insecure Default in API Auth Key Verification
**Vulnerability:** The Python webhook API validation logic used a hardcoded fallback value (`default_secret_key`) for its environment variable configuration (`os.getenv("SIDE_CAR_API_KEY", "default_secret_key")`).
**Learning:** This architectural pattern (having an insecure fallback when an environment variable isn't set) creates a dangerous backdoor if the production server environment is ever misconfigured or if `.env` fails to load.
**Prevention:** Always fail securely by throwing an error or halting startup when critical security configurations (like secret keys or passwords) are missing. Do not use default insecure fallbacks in production endpoints.

## 2024-04-24 - Enable Webhook Signature Verifications
**Vulnerability:** Monetization webhooks (Stripe, GitHub Sponsors) had their payload signature verification logic commented out, exposing endpoints to spoofed payloads that could fraudulently skew revenue metrics. Furthermore, missing encoding caused TypeErrors when `hmac.compare_digest` was run.
**Learning:** External webhook handling modules need to ensure production secrets are strictly enforced (`os.getenv` without fallback) and that cryptographic digest comparisons properly encode both arguments.
**Prevention:** Implement automated security scanning to detect commented-out authentication/verification logic and enforce strict typing/byte encoding for Python `hmac` operations.
## 2025-05-18 - PII Leakage in Error Boundaries and Firestore Wrappers
**Vulnerability:** Personally Identifiable Information (PII) such as user emails, IDs, and OAuth provider tokens were being passed into a `FirestoreErrorInfo` object and stringified directly into generic Error exceptions inside `handleFirestoreError`. Additionally, the frontend `ErrorBoundary.tsx` was rendering raw `.toString()` error output directly to the UI using a `<details>` HTML tag.
**Learning:** Error boundaries and centralized API error handlers are common vectors for unintentional information disclosure. Combining a verbose backend error object with a verbose frontend error renderer creates a direct pipeline for PII leakage to end users or browser monitoring extensions.
**Prevention:** Sanitize error interfaces to exclude auth metadata before throwing. In React Error Boundaries, replace raw stringified errors with generic user-friendly messages (e.g., "An unexpected error occurred"), and isolate raw error details strictly to the console (using `console.error`'s subsequent arguments rather than string interpolation) so they are preserved for local debugging without exposing them to the UI layer.
