## 2024-04-17 - Added missing ARIA labels to icon-only buttons
**Learning:** Found several core UI components (SaveLoadModal, ImmersiveStartMenu, GltfExportButton) relying on icon-only buttons without `aria-label`s. This is an accessibility issue that prevents screen readers from understanding the button's purpose.
**Action:** Added descriptive `aria-label`s to these buttons. Going forward, check for `aria-label`s on any newly created icon-only buttons.
