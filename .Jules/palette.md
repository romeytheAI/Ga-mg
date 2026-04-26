## 2024-05-15 - Adding ARIA Labels to Lucide Icons in Modals
**Learning:** When using Lucide React icons within buttons for modals, they are inherently inaccessible to screen readers without an explicit aria-label on the parent button tag. This is a common pattern in this project's modals.
**Action:** Always verify that icon-only buttons in new components, particularly modals, are provided with a descriptive aria-label.

## 2024-05-18 - Custom UI Toggle Switches WAI-ARIA Compliance
**Learning:** When implementing custom UI toggle switches (e.g., using `div` or `button` elements instead of `<input type="checkbox">`), they must be marked up with WAI-ARIA attributes (`role="switch"`, `aria-checked={active}`) to ensure screen readers can understand and interact with them properly.
**Action:** Always add appropriate roles and aria-checked attributes when creating custom toggles to maintain accessibility.

## 2024-05-18 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** In the project's modals, icon-only buttons (like those using the Lucide `<X>` icon for closing) frequently lack accessible names. This creates barriers for screen reader users who cannot visually determine the button's purpose.
**Action:** Always verify that `<button>` tags containing only `<svg>` or icon components have a descriptive `aria-label` attribute (e.g., `aria-label="Close Modal"`).

## 2024-04-26 - Color Swatch Accessibility Pattern
**Learning:** Found instances where color swatches (e.g., skin, eye, or hair color selection in character creation) were implemented as empty `<button>` tags relying purely on `style={{ backgroundColor: color }}`. This creates an accessibility barrier as the elements lack child text and are invisible to screen readers, while also offering no tooltip for sighted users trying to decipher ambiguous colors.
**Action:** Always provide explicit `aria-label` and `title` attributes (e.g., `aria-label={"Select skin tone " + color}`) for interactive elements that use purely visual properties (like CSS background colors) to convey meaning.
