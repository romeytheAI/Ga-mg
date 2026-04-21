## 2024-05-15 - Adding ARIA Labels to Lucide Icons in Modals
**Learning:** When using Lucide React icons within buttons for modals, they are inherently inaccessible to screen readers without an explicit aria-label on the parent button tag. This is a common pattern in this project's modals.
**Action:** Always verify that icon-only buttons in new components, particularly modals, are provided with a descriptive aria-label.

## 2024-05-18 - Custom UI Toggle Switches WAI-ARIA Compliance
**Learning:** When implementing custom UI toggle switches (e.g., using `div` or `button` elements instead of `<input type="checkbox">`), they must be marked up with WAI-ARIA attributes (`role="switch"`, `aria-checked={active}`) to ensure screen readers can understand and interact with them properly.
**Action:** Always add appropriate roles and aria-checked attributes when creating custom toggles to maintain accessibility.
