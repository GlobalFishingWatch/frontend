---
name: Report Timeseries Pipeline
slug: report-timeseries-pipeline
type: system
sources:
  - path: apps/platform/features/_reports/reports-timeseries-shared.utils.ts
    hash: c581f263f918c421cf36e408109e87f012639329906fd28453a7bebf0fc1c9e3
  - path: apps/platform/features/_reports/reports-timeseries.hooks.ts
    hash: 9f80b991a2de7e03a76b93da32df3d777be73954eb92eeba511caa4f7a1d8bf8
  - path: apps/platform/features/_reports/reports-timeseries.utils.ts
    hash: bcf24bfb02260558b34645c4f8439b46ad3e61bed21cd2222ead42cdb7763272
sources_digest: dfdce021e20a332bc8e0359b67e085a2d9d1ed38385987f10b3860c7fa0daddf
links:
  - to: geospatial-filtering-worker
    relation: uses
    description: >-
      Delegates polygon-based cell filtering to Web Worker to avoid main-thread
      blocking
  - to: hotspot-computation
    relation: uses
    description: >-
      Provides filtered timeseries features and loading state to hotspot
      geometry calculation
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Reads report category, area bounds, and dataview configuration to filter
      layers
generator:
  version: 1
covers:
  - symbol: TimeSeriesFrame
    kind: interface
    at: 'apps/platform/features/_reports/reports-timeseries-shared.utils.ts:L10-L16'
  - symbol: TimeSeries
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries-shared.utils.ts:L18-L22'
  - symbol: frameTimeseriesToDateTimeseries
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries-shared.utils.ts:L24-L37'
  - symbol: getStatsValue
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries-shared.utils.ts:L39-L59'
  - symbol: EvolutionGraphData
    kind: interface
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L67-L72'
  - symbol: ReportSublayerGraph
    kind: interface
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L74-L80'
  - symbol: ReportGraphMode
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L82-L82'
  - symbol: getReportGraphMode
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L84-L88'
  - symbol: ReportGraphProps
    kind: interface
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L90-L96'
  - symbol: FourwingsReportGraphStats
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L98-L103'
  - symbol: PointsReportGraphStats
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L105-L110'
  - symbol: PolygonsReportTopArea
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L112-L118'
  - symbol: PolygonsReportGraphStats
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L120-L129'
  - symbol: ReportGraphStats
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L131-L134'
  - symbol: ReportState
    kind: interface
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L136-L141'
  - symbol: useTimeseriesStats
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L154-L156'
  - symbol: useReportInstances
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L158-L188'
  - symbol: useReportFeaturesLoading
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L190-L192'
  - symbol: getFeaturesFilteredByArea
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L204-L276'
  - symbol: useReportTimeseries
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L278-L461'
  - symbol: processFeatures
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L385-L421'
  - symbol: useComputeReportTimeSeries
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L464-L467'
  - symbol: useReportTimeSeriesErrors
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L469-L472'
  - symbol: useReportFilteredTimeSeries
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L475-L508'
  - symbol: useReportFilteredFeatures
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.hooks.ts:L510-L512'
  - symbol: ReportFourwingsDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L43-L43'
  - symbol: ReportPointsDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L44-L44'
  - symbol: ReportPolygonsDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L45-L45'
  - symbol: ReportDeckLayer
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L46-L47'
  - symbol: GetTimeseriesParams
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L49-L52'
  - symbol: isInstanceOfPointsLayer
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L54-L56'
  - symbol: isInstanceOfPolygonLayer
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L58-L60'
  - symbol: GetPolygonsStatsParams
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L64-L70'
  - symbol: getFeatureCount
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L77-L80'
  - symbol: getFeaturesCount
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L82-L84'
  - symbol: getCountsBySublayer
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L86-L96'
  - symbol: getPolygonsTimeseriesStats
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L98-L241'
  - symbol: addTopArea
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L147-L160'
  - symbol: getTimeseries
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L243-L269'
  - symbol: GetTimeseriesStatsParams
    kind: type
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L271-L275'
  - symbol: getTimeseriesStats
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L277-L320'
  - symbol: filterTimeseriesByTimerange
    kind: function
    at: 'apps/platform/features/_reports/reports-timeseries.utils.ts:L322-L347'
---

<!-- context:generated:start -->

## Summary

Orchestrates multi-layer timeseries data fetching and statistical aggregation for activity/events reports across Fourwings cells, point geometries, and polygon features. Coordinates polygon-based spatial filtering via Web Worker, debounces area changes, and exports computed evolution/comparison graphs via Jotai atoms.

## Related

- uses [[geospatial-filtering-worker]] — Delegates polygon-based cell filtering to Web Worker to avoid main-thread blocking
- uses [[hotspot-computation]] — Provides filtered timeseries features and loading state to hotspot geometry calculation
- depends on [[workspace-routing-state]] — Reads report category, area bounds, and dataview configuration to filter layers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
