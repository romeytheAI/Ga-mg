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
## 2024-06-25 - Prevent DOM-based XSS via innerHTML +=
**Vulnerability:** Global error handler in index.html used `document.body.innerHTML +=` to render error messages, allowing execution of potentially malicious payload contained in the error string.
**Learning:** `innerHTML +=` is not only an XSS risk but forces the browser to expensively re-parse all body content.
**Prevention:** Always use `document.createElement` combined with `textContent` for safe DOM appending.

## 2024-06-25 - Prevent Stack Trace Leakage to UI
**Vulnerability:** ErrorBoundary component blindly rendered `error.toString()` to the DOM.
**Learning:** Never expose raw error objects or stack traces to end users as they can leak path structures, dependencies, or secrets.
**Prevention:** Catch errors for logging, but only present generic "Something went wrong" messages to the user UI.

## 2024-06-25 - Prevent Sensitive Data Leakage from Error Objects
**Vulnerability:** Firebase error handler embedded the full authenticated user object (including emails and provider tokens) into the error payload which was then stringified and thrown.
**Learning:** Error objects that bubble up to the UI or monitoring services should never contain PII (Personally Identifiable Information).
**Prevention:** Strip sensitive metadata from custom error objects before throwing them. Send complete error details securely to a logger (`console.error` as a subsequent argument), but not in the error string.
