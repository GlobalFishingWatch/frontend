---
name: D3 Scale & Date Transformation Pattern
slug: d3-scale-date-transformation-pattern
type: concept
sources:
  - path: libs/timebar/src/timeline/timeline.tsx
    hash: bacb528fba9336e0978ed7dad99c60d6cc260d1cdfa68f709de5216b34a1780c
  - path: libs/timebar/src/timeline/use-pointer-interaction.ts
    hash: e0f678a23178b86cc4139759b56e510fe01788b954ffa08b71ed8be50fc93498
  - path: libs/timebar/src/timeline/use-zoom-out-loop.ts
    hash: 5adf0db5acafeec0f39386943fa234f0124e58f20c5dc4404dde5aaa5c92b162
sources_digest: c254db6a6380870131a8f8da3b6f70651650740c8b8afbc685715acc1d6b5c33
links:
  - to: refs-based-closure-management
    relation: depends_on
    description: >-
      innerScaleRef and outerScaleRef must be updated in sync with state to
      ensure window event handlers read current scale state without
      re-registration
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

Core pattern for mapping pixel coordinates to dates via D3 scaleTime instances (innerScale, outerScale, overallScale). The innerScale is rebuilt during pan interactions to maintain correct pixel-to-domain mappings across drag gestures, while refs-based state prevents stale scale functions in async event handlers. Window-level listeners invert screen positions back to ISO dates for range emission and unit sticking.

## Related

- depends on [[refs-based-closure-management]] — innerScaleRef and outerScaleRef must be updated in sync with state to ensure window event handlers read current scale state without re-registration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
