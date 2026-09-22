---
name: Chart Rendering Engine
slug: chart-rendering-engine
type: system
sources:
  - path: libs/timebar/src/charts/charts.utils.ts
    hash: e705503c02bb4f70fed4fd144f4c47fa6e236ce03a50445f5b5e65011103881f
  - path: libs/timebar/src/charts/stacked-activity.tsx
    hash: 368bb49e97273c5cdf202da67dedc170293843e685df16d67a17f60e0e78a484
  - path: libs/timebar/src/charts/tracks-events.tsx
    hash: aa0a2ef96e2fc38428d8c45c8bd84c4af060473470e87037c65f03690ce08c20
  - path: libs/timebar/src/charts/tracks-graph.tsx
    hash: 6cab8bf819e68a54035a643c90eb49faf9fc3c0ce6b6a355981b560542a6398d
sources_digest: 2d027818397ca81957aa949914ec62342c9e212f2d9af0514c3aa824ecec4649
links:
  - to: charts-store-atoms
    relation: uses
    description: >-
      Updates Jotai atoms to manage layer geometries and chart data for deck.gl
      rendering
  - to: interactive-tooltip-system
    relation: produces
    description: >-
      Emits active chart data state (activeChartsDataState atom) that the
      highlighter tooltip consumes to display values at hover positions
  - to: layout-mathematics
    relation: uses
    description: >-
      Uses getTrackY and margin constants to compute vertical positioning for
      multi-track layouts
  - to: timeline-context-system
    relation: depends_on
    description: >-
      Consumes viewport dimensions, orientation, and d3 scales from
      TimelineContext to position geometries correctly on the timeline
generator:
  version: 1
covers:
  - symbol: getTrackY
    kind: function
    at: 'libs/timebar/src/charts/charts.utils.ts:L7-L28'
  - symbol: getSubLayers
    kind: function
    at: 'libs/timebar/src/charts/stacked-activity.tsx:L24-L25'
  - symbol: getEdges
    kind: function
    at: 'libs/timebar/src/charts/stacked-activity.tsx:L27-L39'
  - symbol: TimebarStackedActivity
    kind: function
    at: 'libs/timebar/src/charts/stacked-activity.tsx:L41-L116'
  - symbol: toDeckColor
    kind: function
    at: 'libs/timebar/src/charts/tracks-events.tsx:L40-L43'
  - symbol: EventDatum
    kind: type
    at: 'libs/timebar/src/charts/tracks-events.tsx:L45-L55'
  - symbol: LineDatum
    kind: type
    at: 'libs/timebar/src/charts/tracks-events.tsx:L57-L57'
  - symbol: getTracksEventsWithCoords
    kind: function
    at: 'libs/timebar/src/charts/tracks-events.tsx:L59-L80'
  - symbol: getTracksWithCoords
    kind: function
    at: 'libs/timebar/src/charts/tracks-events.tsx:L82-L104'
  - symbol: TimebarTracksEvents
    kind: function
    at: 'libs/timebar/src/charts/tracks-events.tsx:L106-L457'
  - symbol: toMs
    kind: function
    at: 'libs/timebar/src/charts/tracks-events.tsx:L185-L185'
  - symbol: hit
    kind: function
    at: 'libs/timebar/src/charts/tracks-events.tsx:L333-L334'
  - symbol: TimebarChartSteps
    kind: type
    at: 'libs/timebar/src/charts/tracks-graph.tsx:L14-L14'
  - symbol: TimebarChartProps
    kind: type
    at: 'libs/timebar/src/charts/tracks-graph.tsx:L15-L15'
  - symbol: TimebarTracksGraph
    kind: function
    at: 'libs/timebar/src/charts/tracks-graph.tsx:L17-L94'
---

<!-- context:generated:start -->

## Summary

Deck.gl-based visualization layer for temporal event and track data on the timebar timeline. Converts time-series measurements and event records into colored polygon/path geometries positioned along a time axis, with support for multiple track orientations and interactive hover states.

## Related

- uses [[charts-store-atoms]] — Updates Jotai atoms to manage layer geometries and chart data for deck.gl rendering
- produces [[interactive-tooltip-system]] — Emits active chart data state (activeChartsDataState atom) that the highlighter tooltip consumes to display values at hover positions
- uses [[layout-mathematics]] — Uses getTrackY and margin constants to compute vertical positioning for multi-track layouts
- depends on [[timeline-context-system]] — Consumes viewport dimensions, orientation, and d3 scales from TimelineContext to position geometries correctly on the timeline

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
