---
name: Timebar Timeline Interaction System
slug: timebar-timeline-interaction-system
type: system
sources:
  - path: libs/timebar/src/timeline/timeline.interaction.spec.tsx
    hash: 839fa9b2ac4de9b53e602a6b7d7cc8a8f251513bc59fe7cc092ee391b5843dca
  - path: libs/timebar/src/timeline/timeline.tsx
    hash: bacb528fba9336e0978ed7dad99c60d6cc260d1cdfa68f709de5216b34a1780c
  - path: libs/timebar/src/timeline/use-pointer-interaction.ts
    hash: e0f678a23178b86cc4139759b56e510fe01788b954ffa08b71ed8be50fc93498
  - path: libs/timebar/src/timeline/use-timeline-hover.ts
    hash: e2c80e70e49357388ad957bec5866e45604b2d0bb7c1c11d307a0a015994a662
  - path: libs/timebar/src/timeline/use-timeline-layout.ts
    hash: 3086cb7a2b18d49791f310f9c3c5fb2365b80a97150f33f5b3a0292272f27758
  - path: libs/timebar/src/timeline/use-zoom-out-loop.ts
    hash: 5adf0db5acafeec0f39386943fa234f0124e58f20c5dc4404dde5aaa5c92b162
sources_digest: fc8c3c996b5b242d6e388cc5159f648aa3a2b58e137a4f7e66a6fdf79a8facee
links:
  - to: d3-scale-date-transformation-pattern
    relation: implements
    description: >-
      Maintains innerScale, outerScale, and overallScale as D3 scaleTime
      instances; rebuilds innerScale during pans to preserve pixel-to-domain
      mapping while refs prevent stale closures in async handlers
  - to: drag-state-event-sourcing-pattern
    relation: implements
    description: >-
      Emits SEEK_MOVE during panning and SEEK_RELEASE on gesture completion;
      distinguishes drag types (DRAG_INNER for pan, DRAG_START/DRAG_END for edge
      zoom) via resolveDragSource utility
  - to: refs-based-closure-management
    relation: implements
    description: >-
      Uses stateRef, propsRef, rangeRef, innerScaleRef to avoid re-registering
      window event listeners on prop changes; all handler updates flow through
      refs rather than closure capture
  - to: timebar-utilities-helpers
    relation: uses
    description: >-
      Consumes time manipulation (getUTCDate, stickToClosestUnit,
      clampToAbsoluteBoundaries) and layout constants (INNER_START_RATIO,
      INNER_END_RATIO, DRAG_INNER, DRAG_START, DRAG_END) for range resolution
      and boundary enforcement
generator:
  version: 1
covers:
  - symbol: ChangeMock
    kind: type
    at: 'libs/timebar/src/timeline/timeline.interaction.spec.tsx:L9-L9'
  - symbol: renderTimeline
    kind: function
    at: 'libs/timebar/src/timeline/timeline.interaction.spec.tsx:L37-L48'
  - symbol: sourcesOf
    kind: function
    at: 'libs/timebar/src/timeline/timeline.interaction.spec.tsx:L50-L50'
  - symbol: TimebarTimelineProps
    kind: type
    at: 'libs/timebar/src/timeline/timeline.tsx:L34-L48'
  - symbol: TimebarTimeline
    kind: function
    at: 'libs/timebar/src/timeline/timeline.tsx:L50-L321'
  - symbol: Params
    kind: type
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L30-L42'
  - symbol: usePointerInteraction
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L44-L218'
  - symbol: onMouseMoveWindow
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L72-L139'
  - symbol: onMouseUpWindow
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L141-L189'
  - symbol: onInteractionCancel
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L193-L198'
  - symbol: Params
    kind: type
    at: 'libs/timebar/src/timeline/use-timeline-hover.ts:L11-L15'
  - symbol: MoveScale
    kind: type
    at: 'libs/timebar/src/timeline/use-timeline-hover.ts:L17-L17'
  - symbol: ThrottledEmit
    kind: type
    at: 'libs/timebar/src/timeline/use-timeline-hover.ts:L19-L22'
  - symbol: useTimelineHover
    kind: function
    at: 'libs/timebar/src/timeline/use-timeline-hover.ts:L24-L51'
  - symbol: report
    kind: method
    at: 'libs/timebar/src/timeline/use-timeline-hover.ts:L39-L41'
  - symbol: leave
    kind: method
    at: 'libs/timebar/src/timeline/use-timeline-hover.ts:L42-L47'
  - symbol: Params
    kind: type
    at: 'libs/timebar/src/timeline/use-timeline-layout.ts:L7-L11'
  - symbol: useTimelineLayout
    kind: function
    at: 'libs/timebar/src/timeline/use-timeline-layout.ts:L13-L60'
  - symbol: onWindowResize
    kind: function
    at: 'libs/timebar/src/timeline/use-timeline-layout.ts:L15-L37'
  - symbol: Params
    kind: type
    at: 'libs/timebar/src/timeline/use-zoom-out-loop.ts:L16-L21'
  - symbol: useZoomOutLoop
    kind: function
    at: 'libs/timebar/src/timeline/use-zoom-out-loop.ts:L23-L81'
  - symbol: onEnterFrame
    kind: function
    at: 'libs/timebar/src/timeline/use-zoom-out-loop.ts:L28-L74'
---

<!-- context:generated:start -->

## Summary

The timeline component manages interactive time range selection through coordinated mouse, touch, and drag event handling. It integrates D3 time scales for pixel-to-date mapping, refs-based state management to avoid stale closures in window-level listeners, and multiple specialized hooks (usePointerInteraction, useTimelineHover, useTimelineLayout, useZoomOutLoop) that synchronize gesture recognition, hover tooltips, geometric boundaries, and zoom animations.

## Related

- implements [[d3-scale-date-transformation-pattern]] — Maintains innerScale, outerScale, and overallScale as D3 scaleTime instances; rebuilds innerScale during pans to preserve pixel-to-domain mapping while refs prevent stale closures in async handlers
- implements [[drag-state-event-sourcing-pattern]] — Emits SEEK_MOVE during panning and SEEK_RELEASE on gesture completion; distinguishes drag types (DRAG_INNER for pan, DRAG_START/DRAG_END for edge zoom) via resolveDragSource utility
- implements [[refs-based-closure-management]] — Uses stateRef, propsRef, rangeRef, innerScaleRef to avoid re-registering window event listeners on prop changes; all handler updates flow through refs rather than closure capture
- uses [[timebar-utilities-helpers]] — Consumes time manipulation (getUTCDate, stickToClosestUnit, clampToAbsoluteBoundaries) and layout constants (INNER_START_RATIO, INNER_END_RATIO, DRAG_INNER, DRAG_START, DRAG_END) for range resolution and boundary enforcement

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
