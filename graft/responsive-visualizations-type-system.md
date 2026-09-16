---
name: Responsive Visualizations Type System
slug: responsive-visualizations-type-system
type: file
sources:
  - path: libs/responsive-visualizations/src/types.ts
    hash: 619f661bfd5e69d4ffbfef2429481752e0e9273c72895d0132a147f673bbba44
sources_digest: af35cd6e729483214b8cfc2f0c4bc7704d618bf8534e5722f9407d0e88b8ea50
links: []
generator:
  version: 1
covers:
  - symbol: ResponsiveVisualizationMode
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L1-L1'
  - symbol: ResponsiveVisualizationChart
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L3-L3'
  - symbol: ResponsiveVisualizationKey
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L5-L5'
  - symbol: ResponsiveVisualizationLabel
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L7-L7'
  - symbol: ResponsiveVisualizationIndividualValue
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L8-L8'
  - symbol: ResponsiveVisualizationAggregatedObjectValue
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L9-L13'
  - symbol: ResponsiveVisualizationAggregatedValue
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L15-L16'
  - symbol: ResponsiveVisualizationValue
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L18-L24'
  - symbol: ResponsiveVisualizationAggregatedItem
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L26-L29'
  - symbol: ResponsiveVisualizationIndividualItem
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L30-L33'
  - symbol: ResponsiveVisualizationItem
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L35-L37'
  - symbol: ResponsiveVisualizationData
    kind: type
    at: 'libs/responsive-visualizations/src/types.ts:L39-L49'
---

<!-- context:generated:start -->

## Summary

Defines the core type hierarchy for responsive charts: ResponsiveVisualizationMode ('aggregated' | 'individual') discriminates data shape; ResponsiveVisualizationValue is a polymorphic type that narrows to numbers/labeled objects in aggregated mode or record objects in individual mode; ResponsiveVisualizationData and ResponsiveVisualizationItem wrap values into datasets indexed by string keys.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
