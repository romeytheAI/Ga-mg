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

## 2024-06-05 - Information Leakage Prevention in Errors
**Vulnerability:** ErrorBoundary components and backend error handlers logging or rendering full error objects which expose sensitive PII (like authentication tokens or user emails) and stack traces to either the DOM or browser console.
**Learning:** In React UI contexts and client/server integrations like Firebase, catching raw errors and simply calling `.toString()` or `JSON.stringify()` on them for display/logging often unintentionally leaks sensitive data, breaking zero-trust logging practices.
**Prevention:** Sanitize custom error payload interfaces (e.g. `FirestoreErrorInfo`) of all PII. Render only generic text to users ("An unexpected error occurred"). For observability, attach raw errors as subsequent positional arguments to `console.error` rather than directly stringifying them into single error strings. Ensure the sanitized error object is still passed along if it contains safe diagnostic data.
