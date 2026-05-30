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
## 2024-05-30 - Prevent PII Data Leakage in Error Handling
**Vulnerability:** The `handleFirestoreError` function in `src/firebase.ts` was collecting sensitive PII (emails, auth providers, user IDs) via the `authInfo` property and dumping it into stringified objects logged via `console.error` and thrown in application errors. Additionally, `ErrorBoundary.tsx` was logging complete error info/stack traces to the console and rendering the raw `error.toString()` in the DOM, potentially exposing internal structure to users.
**Learning:** Developers sometimes over-eagerly log `auth` info to aid debugging without realizing that error reporting systems (like Sentry) or standard logs shouldn't contain stringified PII by default. Also, rendering error stack traces in React error boundaries is a known leakage vector.
**Prevention:** Always isolate PII when constructing error diagnostic objects. Never stringify error objects for `console.error`; pass them as additional arguments. Ensure React Error Boundaries only render safe, generic `error.message` strings to the DOM, not `error.toString()`.
## 2024-05-30 - Fix CI Workflows
**Vulnerability:** CI workflows failed due to missing action resolution and flaky test assertions.
**Learning:** Flaky tests can cause unexpected CI failures; sometimes, tests check for substrings in randomized outputs, leading to intermittent failures.
**Prevention:** Make assertions robust to randomization by checking for deterministic aspects of the output.
