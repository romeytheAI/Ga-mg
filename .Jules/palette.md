## 2026-04-17 - Icon-only buttons lacking ARIA labels
**Learning:** Found multiple instances of `<button><X /></button>` used for closing modals without screen-reader accessible labels.
**Action:** Always add `aria-label="Close modal"` (or similar context) to icon-only buttons to ensure keyboard and screen-reader accessibility.