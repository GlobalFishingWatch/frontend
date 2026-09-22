---
name: SVG Branding Asset Pattern
slug: svg-branding-asset-pattern
type: concept
sources:
  - path: libs/ui-components/src/logo/Logo.tsx
    hash: 550d2b57962f29837cdac2c197e3152d7261a8610e4d2827b9b83d0964d20b5e
  - path: libs/ui-components/src/logo/Logo.types.ts
    hash: a797535aed0ff45b26f577cbc3926dd3969d2aaced8f66d76b5a7428ee0555dd
sources_digest: de4752913da5a02dab9dea80cf8b200c205c704386a35dbeab6dca13a7e4d473
links:
  - to: global-branding-navigation
    relation: implements
    description: >-
      Logo uses SVG branding assets with type-based CSS styling for visual
      variants
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
---

<!-- context:generated:start -->

## Summary

Logo component implements a thin presentational wrapper around SVG branding assets with type-based styling applied through CSS lookups. The component uses hard-coded SVG viewBox and dimensions, dual text elements where the main brand text shifts vertically when a subBrand label is present, and type-safe configuration via LogoTypes (default, invert) and SubBrands enum. Dependencies on Logo.types maintain a clean separation between type contracts and rendering logic. The component applies conditional y-positioning and type-based CSS class selection (styles[type]) to achieve visual variants without duplicating SVG markup.

## Related

- implements [[global-branding-navigation]] — Logo uses SVG branding assets with type-based CSS styling for visual variants

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
