---
name: Timebar Chart Types
slug: timebar-chart-types
type: file
sources:
  - path: libs/timebar/src/charts/charts.types.ts
    hash: 49ed51ea9d160bd99d19b70e0cd079caa092e905542f53acb10ac769fb313c3a
sources_digest: 1ac84a7792b0178d1d0cd1b8f7c148b1f76c5e783e9b67997822a71127e6d5e9
links: []
generator:
  version: 1
covers:
  - symbol: TrackChunkProps
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L12-L16'
  - symbol: TrackEventChunkProps
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L18-L25'
  - symbol: TimebarChartValue
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L27-L32'
  - symbol: TimebarChartChunkCluster
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L34-L37'
  - symbol: TimebarChartChunk
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L39-L54'
  - symbol: HighlighterCallbackFnArgs
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L56-L62'
  - symbol: HighlighterCallbackFn
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L64-L64'
  - symbol: HighlighterCallback
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L65-L65'
  - symbol: HighlighterIconCallback
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L66-L66'
  - symbol: HighlighterDateCallback
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L68-L68'
  - symbol: TimebarChartItem
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L70-L86'
  - symbol: TimebarChartData
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L88-L88'
  - symbol: ChartType
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L90-L90'
  - symbol: TimebarChartsData
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L92-L92'
  - symbol: HighlightedChunks
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L94-L94'
  - symbol: Timeseries
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L96-L96'
  - symbol: ActivityTimeseriesFrame
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L98-L98'
  - symbol: TimebarColorScale
    kind: type
    at: 'libs/timebar/src/charts/charts.types.ts:L100-L100'
---

<!-- context:generated:start -->

## Summary

Defines the core type hierarchy for timebar visualizations: TimebarChartData maps chart type IDs to state; TimebarChartItem groups TimebarChartChunk objects (discrete time periods/events) with metadata and filtering; TimebarChartChunk holds temporal bounds, optional event data (EncounterEvent, PortEvent), coordinates, and clustering info; callback types (HighlighterCallbackFn) enable custom highlighting logic.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
