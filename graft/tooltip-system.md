---
name: Tooltip System
slug: tooltip-system
type: system
sources:
  - path: libs/ui-components/src/popover/index.ts
    hash: 86ca89e27b3a7888366432c7a6c408b25d04b80b7d2238d514a2ba69b27d36ac
  - path: libs/ui-components/src/popover/Popover.tsx
    hash: d377df95a8c3baf756a4d85ef128f5e87ef6972c424a07a22504a9f8cb4b1403
sources_digest: 1276f1cfd360efad934b80740c126890457570ee15feb4473e4a0eca94e4d2fa
links:
  - to: floating-ui-integration
    relation: depends_on
    description: >-
      Tooltip is built on Popover which uses @floating-ui/react for intelligent
      repositioning
  - to: input-components
    relation: uses
    description: >-
      InputText, InputDate, and Radio all integrate Tooltip for validation
      feedback and field documentation
  - to: map-legend-system
    relation: uses
    description: ColorRampBrush uses Tooltip for interactive hints on drag handles
generator:
  version: 1
covers:
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

Reusable tooltip component for contextual help, field labels, and interactive hints throughout the UI. Integrates with Popover for positioning and supports configurable placement around trigger elements.

## Related

- depends on [[floating-ui-integration]] — Tooltip is built on Popover which uses @floating-ui/react for intelligent repositioning
- uses [[input-components]] — InputText, InputDate, and Radio all integrate Tooltip for validation feedback and field documentation
- uses [[map-legend-system]] — ColorRampBrush uses Tooltip for interactive hints on drag handles

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
