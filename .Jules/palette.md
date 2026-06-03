## 2024-05-15 - Adding ARIA Labels to Lucide Icons in Modals
**Learning:** When using Lucide React icons within buttons for modals, they are inherently inaccessible to screen readers without an explicit aria-label on the parent button tag. This is a common pattern in this project's modals.
**Action:** Always verify that icon-only buttons in new components, particularly modals, are provided with a descriptive aria-label.

## 2024-05-18 - Custom UI Toggle Switches WAI-ARIA Compliance
**Learning:** When implementing custom UI toggle switches (e.g., using `div` or `button` elements instead of `<input type="checkbox">`), they must be marked up with WAI-ARIA attributes (`role="switch"`, `aria-checked={active}`) to ensure screen readers can understand and interact with them properly.
**Action:** Always add appropriate roles and aria-checked attributes when creating custom toggles to maintain accessibility.

## 2024-05-18 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** In the project's modals, icon-only buttons (like those using the Lucide `<X>` icon for closing) frequently lack accessible names. This creates barriers for screen reader users who cannot visually determine the button's purpose.
**Action:** Always verify that `<button>` tags containing only `<svg>` or icon components have a descriptive `aria-label` attribute (e.g., `aria-label="Close Modal"`).
## 2024-05-18 - Missing ARIA Labels on Swatches & Icon Buttons
**Learning:** Purely visual interactive elements like color swatches (buttons relying entirely on inline CSS `backgroundColor` or custom styling) and +/- statistical adjusters lack inherently accessible names. Using standard Lucide icons inside buttons without accessible names represents a significant usability barrier for screen reader users across modal dialogues and core panels.
**Action:** When implementing visual-only selectors (colors, attribute adjusters, and icon-based action buttons), explicitly require both `aria-label` (for screen readers) and `title` (as an implicit tooltip for standard pointer devices).
