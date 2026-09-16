---
name: Layout & Container Components
slug: layout-container-components
type: system
sources:
  - path: libs/ui-components/src/modal/index.ts
    hash: df52664337ed21c6be59760b85c4b7ec01c38a22386e1889a8c4e025a7b99050
  - path: libs/ui-components/src/modal/Modal.tsx
    hash: 92aeb5ed6bb6ac8e862aa2658038bfb5accbfbf2c4f3d901692c974c26fc51cd
  - path: libs/ui-components/src/popover/index.ts
    hash: 86ca89e27b3a7888366432c7a6c408b25d04b80b7d2238d514a2ba69b27d36ac
  - path: libs/ui-components/src/popover/Popover.tsx
    hash: d377df95a8c3baf756a4d85ef128f5e87ef6972c424a07a22504a9f8cb4b1403
sources_digest: 2dc566e9150ef51b445a57457f876adb9207069740b89d86f46ee757322b493c
links:
  - to: floating-ui-integration
    relation: depends_on
    description: >-
      Popover depends on @floating-ui/react for intelligent positioning around
      trigger elements
  - to: icon-system
    relation: uses
    description: Modal and Popover use IconButton for close/dismiss affordances
  - to: react-aria-integration
    relation: depends_on
    description: >-
      Modal depends on react-aria-components/Modal for accessible overlay and
      keyboard handling
generator:
  version: 1
covers:
  - symbol: ModalBaseProps
    kind: type
    at: 'libs/ui-components/src/modal/Modal.tsx:L10-L20'
  - symbol: ModalProps
    kind: type
    at: 'libs/ui-components/src/modal/Modal.tsx:L27-L28'
  - symbol: Modal
    kind: function
    at: 'libs/ui-components/src/modal/Modal.tsx:L30-L93'
  - symbol: PopoverProps
    kind: type
    at: 'libs/ui-components/src/popover/Popover.tsx:L22-L35'
  - symbol: OptionalPortal
    kind: function
    at: 'libs/ui-components/src/popover/Popover.tsx:L37-L39'
  - symbol: Popover
    kind: function
    at: 'libs/ui-components/src/popover/Popover.tsx:L41-L116'
---

<!-- context:generated:start -->

## Summary

Modal, card, tabs, split-view, and popover containers that provide structural scaffolding and overlay management for complex UI layouts. Modal and Popover leverage react-aria-components and floating-ui respectively for accessible positioning and keyboard handling.

## Related

- depends on [[floating-ui-integration]] — Popover depends on @floating-ui/react for intelligent positioning around trigger elements
- uses [[icon-system]] — Modal and Popover use IconButton for close/dismiss affordances
- depends on [[react-aria-integration]] — Modal depends on react-aria-components/Modal for accessible overlay and keyboard handling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
