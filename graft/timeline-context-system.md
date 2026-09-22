---
name: Timeline Context System
slug: timeline-context-system
type: system
sources:
  - path: libs/timebar/src/timeline/timeline-context.ts
    hash: 7597c4dc3591bd2d3fb85a65c9a0a1de8c256a5a2b3bb7f5a06dfbc816d15bd8
sources_digest: e8ab549a444d25360369adf6051bf5305281d69167b179a0e910801360789942
links:
  - to: chart-rendering-engine
    relation: implements
    description: >-
      Chart components consume TimelineScale and viewport dimensions to position
      geometries and subscribe to orientation changes
  - to: timeline-drag-handler
    relation: configures
    description: >-
      Drag interactions update the timeline state which flows back into
      TimelineContext, changing scales and boundaries for all charts
  - to: timeline-layout-labels
    relation: implements
    description: >-
      Timeline units use outerScale from context to position clickable time unit
      labels on the axis
generator:
  version: 1
covers:
  - symbol: TimelineScale
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L6-L6'
  - symbol: TrackGraphOrientation
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L8-L8'
  - symbol: TimebarLocale
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L11-L11'
  - symbol: TimebarMouseLeaveHandler
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L13-L13'
  - symbol: TimebarMouseMoveHandler
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L14-L18'
  - symbol: ISODateString
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L21-L21'
  - symbol: StickUnit
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L24-L24'
  - symbol: TimelineContextProps
    kind: type
    at: 'libs/timebar/src/timeline/timeline-context.ts:L26-L34'
---

<!-- context:generated:start -->

## Summary

React context layer providing d3 time scales, viewport boundaries, and rendering orientation to all descendant chart and timeline components. Encapsulates the geometry-to-pixel transformation and allows dragging interactions to update the visible time range across the entire visualization.

## Related

- implements [[chart-rendering-engine]] — Chart components consume TimelineScale and viewport dimensions to position geometries and subscribe to orientation changes
- configures [[timeline-drag-handler]] — Drag interactions update the timeline state which flows back into TimelineContext, changing scales and boundaries for all charts
- implements [[timeline-layout-labels]] — Timeline units use outerScale from context to position clickable time unit labels on the axis

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
