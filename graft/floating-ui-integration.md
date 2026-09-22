---
name: Floating UI Integration
slug: floating-ui-integration
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/PopupWrapper.tsx
    hash: b034d77300909c0d0bff1a9ca9c149a96feda23fbbcc2d4e40f9c463701e003d
  - path: libs/ui-components/src/popover/Popover.tsx
    hash: d377df95a8c3baf756a4d85ef128f5e87ef6972c424a07a22504a9f8cb4b1403
sources_digest: 0cc3c466f0aaf090064ba823cdc0afbb91bfdb20ff21a93cb654737b2d11ce2b
links:
  - to: layout-container-components
    relation: implements
    description: Popover uses Floating UI for intelligent positioning
  - to: popup-layout-components
    relation: part_of
    description: Floating UI integration is implemented in PopupWrapper
  - to: tooltip-system
    relation: implements
    description: Tooltip is built on Popover and inherits Floating UI positioning
generator:
  version: 1
covers:
  - symbol: getBoundary
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L26-L26'
  - symbol: OFF_MAP_RECT
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L27-L27'
  - symbol: PopupWrapperProps
    kind: type
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L29-L38'
  - symbol: PopupWrapper
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L40-L142'
  - symbol: apply
    kind: method
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L90-L92'
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

Cross-cutting dependency on @floating-ui/react used by Popover (and transitively by Tooltip) to intelligently position floating content relative to trigger elements. Floating UI handles viewport overflow detection and repositioning via a middleware stack (offset, flip, shift, arrow) that automatically adjusts placement when content would go off-screen. The OptionalPortal helper conditionally renders content in FloatingPortal to escape CSS overflow clips, and the useFloating composition with useClick, useDismiss, and useRole handles both interaction and semantics. This decouples positioning logic from component implementations, making Popover and Tooltip predictably responsive to layout changes.

## Related

- implements [[layout-container-components]] — Popover uses Floating UI for intelligent positioning
- part of [[popup-layout-components]] — Floating UI integration is implemented in PopupWrapper
- implements [[tooltip-system]] — Tooltip is built on Popover and inherits Floating UI positioning

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
