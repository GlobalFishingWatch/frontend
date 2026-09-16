---
name: Density-Based Rendering Decision
slug: density-based-rendering-decision
type: file
sources:
  - path: libs/responsive-visualizations/src/lib/density.ts
    hash: 3bf431daabd510b2a7b870f6153fea8de76c725b1a5e506ce288faeb282428ef
sources_digest: 99c86d276a97c6c2deb81c83c658542114a83244a5fae80b46f63812f5d3eed0
links:
  - to: chart-configuration-defaults
    relation: depends_on
    description: 'References COLUMN_PADDING, POINT_GAP, MAX_INDIVIDUAL_ITEMS, POINT_SIZES'
  - to: value-key-extraction-normalization
    relation: uses
    description: >-
      Calls getResponsiveVisualizationItemValue for value extraction in
      getColumnsStats
generator:
  version: 1
covers:
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

Calculates layout density metrics to determine whether individual-level data rendering is feasible. getIsIndividualBarChartSupported and getIsIndividualTimeseriesSupported test candidate point sizes against available dimensions and MAX_INDIVIDUAL_ITEMS limit; getBarProps computes column widths; getColumnsStats aggregates or counts values across data columns with fallback logic.

## Related

- depends on [[chart-configuration-defaults]] — References COLUMN_PADDING, POINT_GAP, MAX_INDIVIDUAL_ITEMS, POINT_SIZES
- uses [[value-key-extraction-normalization]] — Calls getResponsiveVisualizationItemValue for value extraction in getColumnsStats

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
