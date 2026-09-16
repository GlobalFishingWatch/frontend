---
name: Interactive Tooltip System
slug: interactive-tooltip-system
type: file
sources:
  - path: libs/timebar/src/charts/highlighter.tsx
    hash: beeba0123b70fa3f05eae070ce1000f8ce425e59ed6e5e11a7cb809f8183a68d
sources_digest: 532bcee849694fb825e5749b98a78202a906300724c35c05cb744bf2b391f985
links:
  - to: chart-rendering-engine
    relation: depends_on
    description: >-
      Reads activeChartsDataState from the chart rendering store to retrieve
      current track values and event chunks at hover position
  - to: time-representation-conventions
    relation: depends_on
    description: >-
      Uses ISO date strings and millisecond timestamps consistently, formats
      dates via Luxon DateTime for display
  - to: timeline-context-system
    relation: uses
    description: >-
      Accesses TimelineScale context to convert pixel coordinates to time ranges
      and applies TimelineContext for positioning calculations
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
---

<!-- context:generated:start -->

## Summary

TimebarHighlighter component renders a context-aware tooltip that displays chart data values when hovering over the timeline. It transforms mouse coordinates to data timestamps, looks up overlapping event chunks and track values, and formats labels and icons using optional callbacks from each chart type.

## Related

- depends on [[chart-rendering-engine]] — Reads activeChartsDataState from the chart rendering store to retrieve current track values and event chunks at hover position
- depends on [[time-representation-conventions]] — Uses ISO date strings and millisecond timestamps consistently, formats dates via Luxon DateTime for display
- uses [[timeline-context-system]] — Accesses TimelineScale context to convert pixel coordinates to time ranges and applies TimelineContext for positioning calculations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
