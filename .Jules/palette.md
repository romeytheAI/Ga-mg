## 2024-05-15 - Adding ARIA Labels to Lucide Icons in Modals
**Learning:** When using Lucide React icons within buttons for modals, they are inherently inaccessible to screen readers without an explicit aria-label on the parent button tag. This is a common pattern in this project's modals.
**Action:** Always verify that icon-only buttons in new components, particularly modals, are provided with a descriptive aria-label.

## 2024-05-18 - Custom UI Toggle Switches WAI-ARIA Compliance
**Learning:** When implementing custom UI toggle switches (e.g., using `div` or `button` elements instead of `<input type="checkbox">`), they must be marked up with WAI-ARIA attributes (`role="switch"`, `aria-checked={active}`) to ensure screen readers can understand and interact with them properly.
**Action:** Always add appropriate roles and aria-checked attributes when creating custom toggles to maintain accessibility.

## 2024-05-18 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** In the project's modals, icon-only buttons (like those using the Lucide `<X>` icon for closing) frequently lack accessible names. This creates barriers for screen reader users who cannot visually determine the button's purpose.
**Action:** Always verify that `<button>` tags containing only `<svg>` or icon components have a descriptive `aria-label` attribute (e.g., `aria-label="Close Modal"`).
## 2024-11-20 - Ensure Aria-Labels on Color Swatch Buttons
**Learning:** Found an accessibility pattern where visual-only buttons used for character appearance selection (e.g. skin/eye/hair color buttons) relied solely on CSS backgrounds. This is a common pattern in the Character Creation UI that requires explicit `aria-label` and `title` to ensure accessibility and usable tooltips.
**Action:** Always verify that map functions generating visual-only choice buttons inject accessible names via `aria-label`.
