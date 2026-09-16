---
name: Polymorphic Chart Data Value Shapes
slug: polymorphic-chart-data-value-shapes
type: concept
sources:
  - path: libs/responsive-visualizations/src/charts/types.ts
    hash: 5e70de502b1f7a96d07666e957f99fb2f8fbd3ab1d36e601badfc56816384101
  - path: libs/responsive-visualizations/src/types.ts
    hash: 619f661bfd5e69d4ffbfef2429481752e0e9273c72895d0132a147f673bbba44
sources_digest: d795f29ab257ee31550fc20806d7823791d9a40879ac77a134002517eb923793
links:
  - to: responsive-visualizations-type-system
    relation: implements
    description: >-
      ResponsiveVisualizationValue and mode-parameterized types implement this
      pattern
generator:
  version: 1
covers:
  - symbol: ResponsiveVisualizationInteractionCallback
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L12-L14'
  - symbol: ResponsiveVisualizationAggregatedValueKey
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L16-L17'
  - symbol: ResponsiveVisualizationIndividualValueKey
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L19-L20'
  - symbol: BaseResponsiveChartProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L22-L36'
  - symbol: BarChartLabelInterval
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L39-L45'
  - symbol: BaseResponsiveBarChartProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L48-L53'
  - symbol: BarChartByTypeProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L55-L63'
  - symbol: BaseResponsiveTimeseriesProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L66-L72'
  - symbol: TimeseriesByTypeProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/types.ts:L74-L81'
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

ResponsiveVisualizationValue is a mode-discriminated union: aggregated mode constrains values to numbers or {label, color, value} objects; individual mode expects arrays of record objects. This pattern allows producers to specify data shape at compile time and ensures consumers access properties safely without runtime type guards, leveraging TypeScript's discriminated union narrowing.

## Related

- implements [[responsive-visualizations-type-system]] — ResponsiveVisualizationValue and mode-parameterized types implement this pattern

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
