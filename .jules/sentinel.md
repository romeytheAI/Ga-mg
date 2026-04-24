## 2025-04-17 - Secure Random Fallbacks and Target Blank Attributes
**Vulnerability:** Weak pseudo-random number generation fallback for UUIDs and potential reverse tabnabbing via target blank without rel noopener.
**Learning:** In frontend web environments, it is common to miss the crypto.getRandomValues API when polyfilling or falling back from crypto.randomUUID. Always check for both.
**Prevention:** Use eslint-plugin-react rules to enforce rel noopener noreferrer on external links. Standardize crypto utilities to prefer Web Crypto API methods before ever relying on Math.random.
## 2026-04-24 - Hardcoded API Key Fallback in Webhooks
**Vulnerability:** The revenue-sidecar webhooks endpoint used a hardcoded fallback string ('default_secret_key') for the SIDE_CAR_API_KEY environment variable. If the env var was not set, an attacker could trivially bypass HMAC validation using this known default.
**Learning:** Fast failure is always preferable to insecure fallbacks. In a deployment, missing environment variables should trigger an immediate halt or 500 status rather than allowing the application to 'succeed' using an insecure baseline.
**Prevention:** Always use `os.getenv('VAR_NAME')` without a default fallback for security-critical keys. Add explicit `if not api_key:` checks that raise `500 Internal Server Error` to catch misconfigurations immediately.
