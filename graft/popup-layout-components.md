---
name: Popup Layout Components
slug: popup-layout-components
type: system
sources:
  - path: apps/platform/features/_map/map/popups/PopupWrapper.tsx
    hash: b034d77300909c0d0bff1a9ca9c149a96feda23fbbcc2d4e40f9c463701e003d
  - path: apps/platform/features/_map/map/popups/shared/PopupSectionLayout.tsx
    hash: eec29f8d41adaefe7c86836fca5729d97553358a1b9578022c6359f909d79793
sources_digest: bdc3cb2712aec82ac77fd79f12f4604634823027aaf03892bcc6a402c533fff0
links:
  - to: floating-ui-integration
    relation: uses
    description: >-
      PopupWrapper uses Floating UI middleware stack for viewport-aware
      positioning
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
  - symbol: PopupSectionLayoutProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/shared/PopupSectionLayout.tsx:L8-L20
  - symbol: PopupSectionLayout
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/shared/PopupSectionLayout.tsx:L22-L58
---

<!-- context:generated:start -->

## Summary

A set of reusable UI components that provide consistent layout, styling, and interaction patterns for map popups across all feature types. PopupSectionLayout structures content with optional headers and icons, PopupWrapper handles Floating UI positioning, and PopupSectionLayout is the primary container used throughout the popup system.

## Related

- uses [[floating-ui-integration]] — PopupWrapper uses Floating UI middleware stack for viewport-aware positioning

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
