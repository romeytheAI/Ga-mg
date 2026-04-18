## 2025-04-17 - Secure Random Fallbacks and Target Blank Attributes
**Vulnerability:** Weak pseudo-random number generation fallback for UUIDs and potential reverse tabnabbing via target blank without rel noopener.
**Learning:** In frontend web environments, it is common to miss the crypto.getRandomValues API when polyfilling or falling back from crypto.randomUUID. Always check for both.
**Prevention:** Use eslint-plugin-react rules to enforce rel noopener noreferrer on external links. Standardize crypto utilities to prefer Web Crypto API methods before ever relying on Math.random.
## 2025-04-17 - Hardening LocalStorage Access and Removing External Dependency Risk
**Vulnerability:** SecurityError unhandled exceptions due to strict cross-origin iframe policies on window.localStorage, and reliance on an un-audited external icon library (`lucide-react`).
**Learning:** Browsers throw DOMExceptions (SecurityError) when accessing `localStorage` in iframes lacking `allow-same-origin` or when users block third-party cookies. Wrapping calls in `try/catch` and providing an ephemeral in-memory fallback ensures graceful degradation without breaking UI components that depend on persistence tracking.
**Prevention:** Centralize all web storage access through a hardened utility module. Remove unnecessary external dependencies when simple native alternatives (like an SVG dictionary for icons) can suffice.
