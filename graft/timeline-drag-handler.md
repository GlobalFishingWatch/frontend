---
name: Timeline Drag Handler
slug: timeline-drag-handler
type: system
sources:
  - path: libs/timebar/src/timeline/timeline-drag.utils.spec.ts
    hash: c4e18b57872105e4cc3a9cd045a34be1aa9ed68bf8a78683754a2e2b033ac3d9
  - path: libs/timebar/src/timeline/timeline-drag.utils.ts
    hash: 53aaf65d025590a3acb29890ad8e39590d8aa40af9d3a5b183e41105179a754a
  - path: libs/timebar/src/timeline/timeline-handler.tsx
    hash: d0c87fe1eef1fc757d1ecb532b73e5842976b0f09c7c687870e172788639a017
sources_digest: 58f76c4ccbb9343757c203d34866457ab3364ff8bf18e6c10c8af5b31c85fcc9
links:
  - to: event-tracking-constants
    relation: uses
    description: >-
      Classifies drag gestures using resolveDragSource to emit EVENT_SOURCE tags
      (DRAG_START, DRAG_END, ZOOM_IN_RELEASE, etc.) for analytics
  - to: time-snapping-boundary-logic
    relation: uses
    description: >-
      Applies stickBoundary and resolveStickRange to snap endpoints to
      hour/day/month boundaries based on zoom direction
  - to: timeline-context-system
    relation: uses
    description: >-
      Updates TimelineState within context when drag events occur, causing scale
      and boundary changes to propagate to all charts
generator:
  version: 1
covers:
  - symbol: millis
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.spec.ts:L17-L17'
  - symbol: Dragging
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L18-L18'
  - symbol: ZoomState
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L25-L29'
  - symbol: getIsHandlerZoomingIn
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L31-L46'
  - symbol: getIsHandlerZoomingOut
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L48-L53'
  - symbol: StickDir
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L55-L55'
  - symbol: stickBoundary
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L57-L61'
  - symbol: resolveStickRange
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L63-L82'
  - symbol: resolveDragSource
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L84-L88'
  - symbol: TimelineState
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L90-L102'
  - symbol: TimelineLatestProps
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L118-L125'
  - symbol: TimeScaleRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L127-L127'
  - symbol: TimelineStateRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L128-L128'
  - symbol: TimelineLatestPropsRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L129-L129'
  - symbol: RangeRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L130-L130'
  - symbol: SetTimelineState
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L131-L131'
  - symbol: HandlerProps
    kind: type
    at: 'libs/timebar/src/timeline/timeline-handler.tsx:L12-L18'
  - symbol: Handler
    kind: function
    at: 'libs/timebar/src/timeline/timeline-handler.tsx:L20-L33'
---

<!-- context:generated:start -->

## Summary

Drag interaction layer that manages mouse events on timeline handlers (start/end range markers). Detects zoom-in/out and seek gestures, applies date snapping to configurable calendar units, enforces minimum handler gap constraints, and emits classified drag events for telemetry via EVENT_SOURCE constants.

## Related

- uses [[event-tracking-constants]] — Classifies drag gestures using resolveDragSource to emit EVENT_SOURCE tags (DRAG_START, DRAG_END, ZOOM_IN_RELEASE, etc.) for analytics
- uses [[time-snapping-boundary-logic]] — Applies stickBoundary and resolveStickRange to snap endpoints to hour/day/month boundaries based on zoom direction
- uses [[timeline-context-system]] — Updates TimelineState within context when drag events occur, causing scale and boundary changes to propagate to all charts

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
