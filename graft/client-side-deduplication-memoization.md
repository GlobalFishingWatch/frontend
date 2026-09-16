---
name: Client-Side Deduplication & Memoization
slug: client-side-deduplication-memoization
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts
    hash: b6c84e444f2fda91756c2852d286971174ea24e23306166dcb69c5d7c876892f
  - path: apps/platform/features/_reports/reports-hotspot.hooks.ts
    hash: 5b6b5961a125533fee35e458802b0e2343a2c0aff9dc2cef45beba6029343b26
  - path: apps/platform/features/_reports/reports-timeseries.hooks.ts
    hash: 9f80b991a2de7e03a76b93da32df3d777be73954eb92eeba511caa4f7a1d8bf8
sources_digest: 7045de3206207d8bf211d9d43ca60d4dffe1c93f978bf8b0f06b33cf940f061d
links:
  - to: report-timeseries-pipeline
    relation: implements
    description: >-
      Uses memoizeOne and hash guards to detect layer state changes and prevent
      duplicate computations
  - to: vessel-group-report-state-management
    relation: implements
    description: >-
      Implements thunk condition callbacks to prevent redundant vessel group
      fetches
generator:
  version: 1
covers:
  - symbol: VesselGroupReport
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L23-L25
  - symbol: ReportState
    kind: interface
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L27-L32
  - symbol: VesselGroupReportSliceState
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L34-L34
  - symbol: FetchVesselGroupReportThunkParams
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L43-L45
  - symbol: fetchVesselGroupVesselIdentities
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L47-L59
  - symbol: selectVGRStatus
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L132-L133
  - symbol: selectVGRError
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L134-L134
  - symbol: selectVGRData
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L135-L136
  - symbol: useComputeReportHotspot
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.hooks.ts:L22-L50'
  - symbol: useHotspotSettings
    kind: function
    at: 'apps/platform/features/_reports/reports-hotspot.hooks.ts:L53-L80'
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
---

<!-- context:generated:start -->

## Summary

Performance optimization pattern preventing redundant data fetching and expensive recomputations: Redux thunk conditions skip refetch if already loading/present, memoizeOne detects layer state changes, hash-based guards prevent duplicate processing on dependency shifts, and Jotai atoms cache computed geometry.

## Related

- implements [[report-timeseries-pipeline]] — Uses memoizeOne and hash guards to detect layer state changes and prevent duplicate computations
- implements [[vessel-group-report-state-management]] — Implements thunk condition callbacks to prevent redundant vessel group fetches

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
