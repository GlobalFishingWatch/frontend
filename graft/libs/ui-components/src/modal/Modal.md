# libs/ui-components/src/modal/Modal.tsx · [[layout-container-components]] [[react-aria-integration]]

A React modal component that renders a dismissible dialog with optional header, title, and configurable size, supporting keyboard escape dismissal.

- ModalBaseProps · type · L10-L20 — Type definition for shared modal configuration properties including visibility, appearance, and close behavior.
- ModalProps · type · L27-L28 — Conditional type that requires ariaLabel when header may be false at runtime, ensuring the modal is always accessible.
- Modal · function · L30-L93 — React component that renders an accessible modal dialog with optional header, title, and close button.
