---
name: Icon System
slug: icon-system
type: system
sources:
  - path: libs/ui-components/src/icon/icon.config.ts
    hash: 3c6ec0a35bf52afa20b1ed678852d82d581d5ec72972dfb02c62af17746e916c
  - path: libs/ui-components/src/icon/Icon.tsx
    hash: 83b9ae048deb4002b6be4c4c5ef674a90d5bd75f08673bee26c230f80360ea55
  - path: libs/ui-components/src/icon/index.ts
    hash: 9fcb8a738b3275ccca6b004ac59b96e86f4a8311fc48f4f6cca6a670966cfff9
sources_digest: af95fd988893103eabbe2c5183be3ab8f4422bc452ef1c4b30ca5cd9db48223e
links:
  - to: global-branding-navigation
    relation: uses
    description: >-
      Logo and Menu components use Icon components for visual identity and
      navigation UI
  - to: input-components
    relation: uses
    description: >-
      All input components display Icon for password toggles, loading
      indicators, and delete affordances
  - to: layout-container-components
    relation: uses
    description: Modal and Popover use Icon via IconButton for close buttons
  - to: map-legend-system
    relation: uses
    description: >-
      Symbols and Bivariate legends render Icon components for data point
      representation
  - to: ui-components-library
    relation: part_of
    description: >-
      Icon system is foundational to the entire ui-components library; Button,
      IconButton, and many other components depend on IconType and Icon
      rendering
generator:
  version: 1
covers:
  - symbol: IconComponent
    kind: type
    at: 'libs/ui-components/src/icon/Icon.tsx:L14-L14'
  - symbol: getIconComponent
    kind: function
    at: 'libs/ui-components/src/icon/Icon.tsx:L22-L24'
  - symbol: IconProps
    kind: interface
    at: 'libs/ui-components/src/icon/Icon.tsx:L26-L34'
  - symbol: Icon
    kind: function
    at: 'libs/ui-components/src/icon/Icon.tsx:L38-L57'
  - symbol: IconType
    kind: type
    at: 'libs/ui-components/src/icon/icon.config.ts:L158-L158'
---

<!-- context:generated:start -->

## Summary

Centralized SVG icon catalog and rendering system providing type-safe icon selection via IconType union derived from icon.config exhaustive list. Icon component dynamically loads SVG assets from ./icons directory using Vite's import.meta.glob with ?react flag for React component import, supports optional tooltips and visual type variants (default/warning/original-colors), and gracefully handles missing icons with warnings.

## Related

- uses [[global-branding-navigation]] — Logo and Menu components use Icon components for visual identity and navigation UI
- uses [[input-components]] — All input components display Icon for password toggles, loading indicators, and delete affordances
- uses [[layout-container-components]] — Modal and Popover use Icon via IconButton for close buttons
- uses [[map-legend-system]] — Symbols and Bivariate legends render Icon components for data point representation
- part of [[ui-components-library]] — Icon system is foundational to the entire ui-components library; Button, IconButton, and many other components depend on IconType and Icon rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
