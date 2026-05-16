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
## 2025-05-18 - Client-Side Error Sanitization
**Vulnerability:** PII leakage in client-side error handling (Firebase error handlers and Error Boundaries).
**Learning:** Raw error objects and nested authentication structures often contain sensitive data like emails, tenant IDs, and tokens. Directly stringifying and logging or rendering these objects exposes this information.
**Prevention:** Explicitly pick non-sensitive fields (like `userId` and `isAnonymous`) for typed error interfaces. When logging errors to the console, pass the raw error object as a subsequent argument rather than stringifying it into the main message. Always provide generic fallback messages in UI error boundaries instead of rendering `error.toString()`.
## 2025-05-18 - CI Action Resolution Failure
**Vulnerability:** Workflow fails to resolve un-tagged or incorrectly versioned custom actions (`google-labs-code/jules-invoke@v1`).
**Learning:** Using `@v1` may fail if the repository only publishes strict semantic versions like `v1.0.0` or if the major tag pointer is missing/corrupted. This breaks the CI/CD pipeline preventing automated checks and autonomous resolutions.
**Prevention:** Always pin custom actions to specific, existing release tags (e.g., `v1.0.0`) to guarantee deterministic workflow execution.
