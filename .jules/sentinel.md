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
## 2025-02-28 - Information Disclosure via Client-Side Error Handling
**Vulnerability:** The application was vulnerable to information disclosure through its client-side error handling mechanisms. `ErrorBoundary.tsx` rendered the stringified output of raw `Error` objects directly to the DOM, potentially exposing stack traces. More critically, `src/firebase.ts` captured and logged highly sensitive Personally Identifiable Information (PII) including user emails, provider details (photo URLs, OAuth emails), tenant IDs, and UIDs as part of `FirestoreErrorInfo`, which was then stringified and thrown as an error to the calling code (and potentially the console/UI).
**Learning:** Overly permissive error logging structures that automatically aggregate global state (like the current user's full auth profile) onto generic utility functions (like database handlers) create a significant risk of PII leakage when those errors surface in observability tools or the UI.
**Prevention:** Do not embed sensitive user data directly into utility error classes or generic error handler payloads unless strictly required. When logging errors to the console, pass the raw error object as a subsequent parameter (e.g., `console.error('Message', errObj)`) rather than stringifying it to prevent accidental exposure to end users while preserving it for developers. Ensure UI boundary components display generic user-friendly messages rather than raw exception details.
