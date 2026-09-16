---
name: Progressive Data Loading Pattern
slug: progressive-data-loading-pattern
type: concept
sources:
  - path: libs/responsive-visualizations/src/charts/hooks.ts
    hash: 57175eb8eecbc4813585bcff2ed001bbe4bb0e0a6f8f9d99f6d064612252a19a
  - path: libs/responsive-visualizations/src/lib/density.ts
    hash: 3bf431daabd510b2a7b870f6153fea8de76c725b1a5e506ce288faeb282428ef
sources_digest: 2cd507af722d2021883647e7e949e70630929660213a75860241137e14235ad5
links:
  - to: density-based-rendering-decision
    relation: implements
    description: >-
      Density checks (getIsIndividualBarChartSupported,
      getIsIndividualTimeseriesSupported) gate whether individual data is worth
      loading
generator:
  version: 1
covers:
  - symbol: useValueKeys
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L24-L37'
  - symbol: ResponsiveVisualizationContainerRef
    kind: type
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L39-L39'
  - symbol: useResponsiveDimensions
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L40-L59'
  - symbol: UseResponsiveVisualizationDataProps
    kind: type
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L61-L72'
  - symbol: useResponsiveVisualizationData
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L74-L183'
  - symbol: useResponsiveVisualization
    kind: function
    at: 'libs/responsive-visualizations/src/charts/hooks.ts:L185-L203'
  - symbol: getBarProps
    kind: function
    at: 'libs/responsive-visualizations/src/lib/density.ts:L24-L34'
  - symbol: ColumnsStats
    kind: type
    at: 'libs/responsive-visualizations/src/lib/density.ts:L36-L39'
  - symbol: getColumnsStats
    kind: function
    at: 'libs/responsive-visualizations/src/lib/density.ts:L40-L62'
  - symbol: IsIndividualSupportedParams
    kind: type
    at: 'libs/responsive-visualizations/src/lib/density.ts:L64-L73'
  - symbol: IsIndividualSupportedResult
    kind: type
    at: 'libs/responsive-visualizations/src/lib/density.ts:L74-L77'
  - symbol: getIsIndividualBarChartSupported
    kind: function
    at: 'libs/responsive-visualizations/src/lib/density.ts:L78-L96'
  - symbol: getIsIndividualTimeseriesSupported
    kind: function
    at: 'libs/responsive-visualizations/src/lib/density.ts:L98-L128'
---

<!-- context:generated:start -->

## Summary

A design pattern used by useResponsiveVisualization and useResponsiveVisualizationData where aggregated data loads first, gets tested for individual rendering support via density metrics, then individual data loads only if supported. Automatic fallback to aggregated or derived counts if individual rendering proves infeasible. This avoids expensive operations for datasets that cannot be meaningfully rendered at granular levels.

## Related

- implements [[density-based-rendering-decision]] — Density checks (getIsIndividualBarChartSupported, getIsIndividualTimeseriesSupported) gate whether individual data is worth loading

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
