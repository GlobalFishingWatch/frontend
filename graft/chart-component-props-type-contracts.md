---
name: Chart Component Props & Type Contracts
slug: chart-component-props-type-contracts
type: file
sources:
  - path: libs/responsive-visualizations/src/charts/types.ts
    hash: 5e70de502b1f7a96d07666e957f99fb2f8fbd3ab1d36e601badfc56816384101
sources_digest: 974dea4791296935168e961ab4faa038e68a020d9776e361ead71ab4298cac65
links:
  - to: responsive-visualizations-type-system
    relation: implements
    description: >-
      Builds mode-safe contracts on top of ResponsiveVisualizationData and
      ResponsiveVisualizationValue
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
---

<!-- context:generated:start -->

## Summary

Establishes prop contracts for chart components: BaseResponsiveChartProps defines shared props (onAggregatedItemClick, onIndividualItemClick, getAggregatedData, getIndividualData, tooltips, icons); BarChartByTypeProps and TimeseriesByTypeProps enforce mode-specific key and value constraints; helper types extract valid property names at compile time.

## Related

- implements [[responsive-visualizations-type-system]] — Builds mode-safe contracts on top of ResponsiveVisualizationData and ResponsiveVisualizationValue

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
