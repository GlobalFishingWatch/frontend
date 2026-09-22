---
name: Global Branding & Navigation
slug: global-branding-navigation
type: system
sources:
  - path: libs/ui-components/src/logo/index.ts
    hash: d1eec4466c443c341a4fcb16555b75e8f197c9e0747e4762f3a8bebf59deda6e
  - path: libs/ui-components/src/logo/Logo.tsx
    hash: 550d2b57962f29837cdac2c197e3152d7261a8610e4d2827b9b83d0964d20b5e
  - path: libs/ui-components/src/logo/Logo.types.ts
    hash: a797535aed0ff45b26f577cbc3926dd3969d2aaced8f66d76b5a7428ee0555dd
  - path: libs/ui-components/src/menu/index.ts
    hash: 693cbe804ad678766b072c8b90f027cc9c5692e098e4e1ab4ebf32a69fd1c9cb
  - path: libs/ui-components/src/menu/Menu.constants.ts
    hash: cbd5a979d19bb99f96892fc3486c3bb5e5170e6e219a77bd0a9f2dc8147aa12e
  - path: libs/ui-components/src/menu/Menu.tsx
    hash: 2773bacff47c8d4271a4454442c413f1de523f3bbad545202b47359cd5161d94
sources_digest: 6b48b2250d6e9317b6dd05ad3120a8b85dd270dcbdaaca0bcdecc8a865076921
links:
  - to: icon-system
    relation: uses
    description: Menu uses IconButton for close button affordance
  - to: layout-container-components
    relation: uses
    description: >-
      Menu wraps content in react-aria-components Modal for accessible overlay
      behavior
  - to: navigation-link-configuration
    relation: implements
    description: >-
      Menu.constants exports MenuLink type and defaultLinks array; Menu renders
      links as anchor tags with external URLs
  - to: svg-branding-asset-pattern
    relation: implements
    description: >-
      Logo uses hard-coded SVG viewBox, dual text elements, and type-based CSS
      lookups for visual variants (default, invert)
generator:
  version: 1
covers:
  - symbol: LogoProps
    kind: interface
    at: 'libs/ui-components/src/logo/Logo.tsx:L8-L12'
  - symbol: Logo
    kind: function
    at: 'libs/ui-components/src/logo/Logo.tsx:L14-L45'
  - symbol: SubBrands
    kind: enum
    at: 'libs/ui-components/src/logo/Logo.types.ts:L1-L5'
  - symbol: LogoTypes
    kind: type
    at: 'libs/ui-components/src/logo/Logo.types.ts:L7-L7'
  - symbol: MenuLink
    kind: type
    at: 'libs/ui-components/src/menu/Menu.constants.ts:L1-L5'
  - symbol: MenuProps
    kind: interface
    at: 'libs/ui-components/src/menu/Menu.tsx:L12-L21'
  - symbol: Menu
    kind: function
    at: 'libs/ui-components/src/menu/Menu.tsx:L23-L68'
---

<!-- context:generated:start -->

## Summary

Logo component and Menu modal system providing application-wide branding and top-level navigation. Logo renders SVG branding with optional sub-brand overlays, while Menu displays a navigation modal with customizable links (defaulting to Global Fishing Watch site sections) and background imagery.

## Related

- uses [[icon-system]] — Menu uses IconButton for close button affordance
- uses [[layout-container-components]] — Menu wraps content in react-aria-components Modal for accessible overlay behavior
- implements [[navigation-link-configuration]] — Menu.constants exports MenuLink type and defaultLinks array; Menu renders links as anchor tags with external URLs
- implements [[svg-branding-asset-pattern]] — Logo uses hard-coded SVG viewBox, dual text elements, and type-based CSS lookups for visual variants (default, invert)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
