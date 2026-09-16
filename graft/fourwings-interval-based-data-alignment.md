---
name: Fourwings Interval-Based Data Alignment
slug: fourwings-interval-based-data-alignment
type: concept
sources:
  - path: libs/responsive-visualizations/src/charts/hooks.ts
    hash: 57175eb8eecbc4813585bcff2ed001bbe4bb0e0a6f8f9d99f6d064612252a19a
  - path: libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts
    hash: 9beae984b9ebf3ac5db6c5e7ca292e728bcd07d98fc0a121cb7a41752a25f154
sources_digest: 940df5fe6dd6c1b79eee16d890ca3e1bc9a3cee87d8f9d579a6b5255565e5bfa
links:
  - to: timeseries-domain-interval-utilities
    relation: implements
    description: useFullTimeseries handles the binning and fallback logic
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
  - symbol: useTimeseriesDomain
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts:L9-L27
  - symbol: UseFullTimeseriesProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts:L29-L37
  - symbol: useFullTimeseries
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts:L39-L87
---

<!-- context:generated:start -->

## Summary

A temporal discretization pattern used in timeseries visualizations where continuous time ranges are divided into uniform intervals (months, days, hours, etc.) defined by FourwingsInterval enum. useFullTimeseries expands sparse data into complete interval-aligned arrays with sensible fallbacks, enabling consistent binning and aggregation across different granularities.

## Related

- implements [[timeseries-domain-interval-utilities]] — useFullTimeseries handles the binning and fallback logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
