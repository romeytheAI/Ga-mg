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

## 2024-05-23 - Prevent PII Leakage in Global Error Handlers
**Vulnerability:** Global error handlers (`ErrorBoundary.tsx` and `handleFirestoreError` in `firebase.ts`) were inadvertently exposing raw PII (emails, auth providers) and internal stack traces. `ErrorBoundary` rendered `error.toString()` directly to the DOM inside `<details>`, and `handleFirestoreError` serialized the full `auth.currentUser` object into the thrown error payload.
**Learning:** Defensive UI programming requires strict separation between *logged* data (which retains context for debugging) and *rendered/thrown* data (which must be sanitized).
**Prevention:**
- Never render raw `error.toString()` in a UI component; map errors to safe, generic user-facing messages.
- Do not construct and throw Error objects containing serialized `authInfo` properties. Pass full context *only* to `console.error(msg, context)` and throw a simplified, sanitized version up the call stack.
