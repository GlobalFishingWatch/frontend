---
name: Refs-Based Closure Management
slug: refs-based-closure-management
type: concept
sources:
  - path: libs/timebar/src/timeline/timeline.tsx
    hash: bacb528fba9336e0978ed7dad99c60d6cc260d1cdfa68f709de5216b34a1780c
  - path: libs/timebar/src/timeline/use-pointer-interaction.ts
    hash: e0f678a23178b86cc4139759b56e510fe01788b954ffa08b71ed8be50fc93498
  - path: libs/timebar/src/timeline/use-timeline-layout.ts
    hash: 3086cb7a2b18d49791f310f9c3c5fb2365b80a97150f33f5b3a0292272f27758
  - path: libs/timebar/src/timeline/use-zoom-out-loop.ts
    hash: 5adf0db5acafeec0f39386943fa234f0124e58f20c5dc4404dde5aaa5c92b162
sources_digest: 939106c470a5995c4b374806cddb4f93274b43e0acb3758caf634ac6ad5942f9
links:
  - to: d3-scale-date-transformation-pattern
    relation: enables
    description: >-
      innerScaleRef and outerScaleRef must remain stable across renders; refs
      pattern allows handlers to read current scale state without triggering
      listener re-registration
  - to: timebar-timeline-interaction-system
    relation: implements
    description: >-
      All timeline hooks use refs-based pattern to coordinate state across async
      window-level event handlers
generator:
  version: 1
covers:
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

Critical pattern preventing stale closures in long-lived window event listeners by maintaining refs (stateRef, propsRef, rangeRef, innerScaleRef, outerScaleRef) that are read synchronously in handlers rather than captured at registration time. The effect dependency array is intentionally empty with lint rule disabled because all necessary data flows through mutable refs. This pattern enables handlers to reflect current state without re-registration when props change, critical for interactive systems where state updates must not disrupt ongoing gestures.

## Related

- enables [[d3-scale-date-transformation-pattern]] — innerScaleRef and outerScaleRef must remain stable across renders; refs pattern allows handlers to read current scale state without triggering listener re-registration
- implements [[timebar-timeline-interaction-system]] — All timeline hooks use refs-based pattern to coordinate state across async window-level event handlers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
