---
name: Responsive Chart Hooks & Orchestration
slug: responsive-chart-hooks-orchestration
type: system
sources:
  - path: libs/responsive-visualizations/src/charts/hooks.ts
    hash: 57175eb8eecbc4813585bcff2ed001bbe4bb0e0a6f8f9d99f6d064612252a19a
sources_digest: 8a0852d464d59a5dc92baa72d19870e2f74eaef600a6ca338681033dec6ce20a
links:
  - to: chart-configuration-defaults
    relation: depends_on
    description: >-
      Reads DEFAULT_AGGREGATED_ITEM_KEY, DEFAULT_POINT_SIZE, and related
      constants
  - to: density-based-rendering-decision
    relation: uses
    description: >-
      Calls getIsIndividualBarChartSupported and
      getIsIndividualTimeseriesSupported to determine if individual-level data
      is feasible
  - to: value-key-extraction-normalization
    relation: uses
    description: >-
      Depends on DEFAULT_LABEL_KEY and uses getResponsiveVisualizationItemValue
      for value extraction
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
---

<!-- context:generated:start -->

## Summary

Provides React hooks that orchestrate responsive chart behavior across responsive visualization components. useResponsiveDimensions tracks container size via ResizeObserver; useResponsiveVisualization chains dimension tracking with async data loading and density-based mode selection (aggregated vs. individual); useValueKeys normalizes value key arrays; useResponsiveVisualizationData manages the progressive load pattern—aggregated first, then individual only if density-supported.

## Related

- depends on [[chart-configuration-defaults]] — Reads DEFAULT_AGGREGATED_ITEM_KEY, DEFAULT_POINT_SIZE, and related constants
- uses [[density-based-rendering-decision]] — Calls getIsIndividualBarChartSupported and getIsIndividualTimeseriesSupported to determine if individual-level data is feasible
- uses [[value-key-extraction-normalization]] — Depends on DEFAULT_LABEL_KEY and uses getResponsiveVisualizationItemValue for value extraction

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
