---
name: Charts Store (Atoms)
slug: charts-store-atoms
type: system
sources:
  - path: libs/timebar/src/charts/highlighter.tsx
    hash: beeba0123b70fa3f05eae070ce1000f8ce425e59ed6e5e11a7cb809f8183a68d
  - path: libs/timebar/src/charts/stacked-activity.tsx
    hash: 368bb49e97273c5cdf202da67dedc170293843e685df16d67a17f60e0e78a484
  - path: libs/timebar/src/charts/tracks-events.tsx
    hash: aa0a2ef96e2fc38428d8c45c8bd84c4af060473470e87037c65f03690ce08c20
  - path: libs/timebar/src/charts/tracks-graph.tsx
    hash: 6cab8bf819e68a54035a643c90eb49faf9fc3c0ce6b6a355981b560542a6398d
sources_digest: b7494b6beaa1fc8c5b5b14a88abdb010755596234001e86b52baabbc7ac5a2f0
links:
  - to: chart-rendering-engine
    relation: implements
    description: >-
      Chart components use useUpdateChartLayers and useUpdateChartsData hooks to
      mutate these atoms with new geometries and data state
  - to: interactive-tooltip-system
    relation: implements
    description: >-
      The highlighter reads these atoms to determine which chart values and
      events to display in the hover tooltip
generator:
  version: 1
covers:
  - symbol: getCoords
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L29-L58'
  - symbol: findChunks
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L60-L82'
  - symbol: findValue
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L84-L93'
  - symbol: HighlighterData
    kind: type
    at: 'libs/timebar/src/charts/highlighter.tsx:L95-L101'
  - symbol: getHighlighterData
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L103-L192'
  - symbol: TimebarHighlighter
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L194-L322'
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

Jotai atom-based state management for chart layer geometries and active data. Maintains activeChartsDataState (track values/event chunks at current time) and hoveredEventState (selected event for highlighting) as reactive atoms that chart components update and the highlighter consumes.

## Related

- implements [[chart-rendering-engine]] — Chart components use useUpdateChartLayers and useUpdateChartsData hooks to mutate these atoms with new geometries and data state
- implements [[interactive-tooltip-system]] — The highlighter reads these atoms to determine which chart values and events to display in the hover tooltip

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
