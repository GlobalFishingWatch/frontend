---
name: Legend Type Dispatch Pattern
slug: legend-type-dispatch-pattern
type: concept
sources:
  - path: libs/ui-components/src/map-legend/MapLegend.tsx
    hash: 58f660a5a2ef3d3acbf0fe9a666d9eba31f57647cf6e6a578b27f638f13fe495
  - path: libs/ui-components/src/map-legend/types.ts
    hash: e71122e56e3c0b6703036cdd4cd971e60be4da5325f3e50b39407b9abfbbd3ca
sources_digest: 2d024e76abd5db855d54c096d1c120cad7d84a95b81254d6d8aadfd64e217a5e
links:
  - to: map-legend-system
    relation: implements
    description: >-
      MapLegend uses discriminated union dispatch to route to specialized legend
      implementations
generator:
  version: 1
covers:
  - symbol: MapLegendProps
    kind: interface
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L19-L26'
  - symbol: MapLegendsProps
    kind: interface
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L28-L30'
  - symbol: MapLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L32-L70'
  - symbol: MapLegends
    kind: function
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L72-L86'
  - symbol: LegendType
    kind: enum
    at: 'libs/ui-components/src/map-legend/types.ts:L3-L9'
  - symbol: BaseLegend
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L11-L19'
  - symbol: UILegendSolid
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L21-L25'
  - symbol: UILegendSymbols
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L27-L33'
  - symbol: UILegendColorRamp
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L35-L41'
  - symbol: UILegendBivariate
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L43-L48'
  - symbol: UILegend
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L50-L50'
---

<!-- context:generated:start -->

## Summary

MapLegend component implements type-safe legend variant routing via discriminated union on UILegend.type, using an exhaustive if-chain to dispatch to specialized implementations (SymbolsLegend, SolidLegend, ColorRampLegend, BivariateLegend). The type system leverages TypeScript's discriminated union narrowing to safely cast variant-specific props at each branch (e.g., UILegendColorRamp includes brush config only for color ramp legends). A design constraint is the lack of a fallback error boundary—the final return null silently handles unexpected types, which could hide bugs if a new legend type is introduced without updating MapLegend. The TODO comment signals pending support for user context and categorical options.

## Related

- implements [[map-legend-system]] — MapLegend uses discriminated union dispatch to route to specialized legend implementations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
