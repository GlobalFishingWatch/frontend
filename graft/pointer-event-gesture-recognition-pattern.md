---
name: Pointer Event Gesture Recognition Pattern
slug: pointer-event-gesture-recognition-pattern
type: concept
sources:
  - path: libs/timebar/src/timeline/use-pointer-interaction.ts
    hash: e0f678a23178b86cc4139759b56e510fe01788b954ffa08b71ed8be50fc93498
  - path: libs/ui-components/src/carousel/Carousel.tsx
    hash: 969a4a944bf8edf04e8ffe8161ca1fe9eb7fe328c642d4350060572fffe2d68e
sources_digest: 04c251bcc1cd7cc2026596d5915a211435a633ecb69ee95a55e2a0e42abf4d15
links:
  - to: carousel-responsive-overflow-detection
    relation: implements
    description: >-
      Carousel uses DRAG_THRESHOLD_PX to distinguish drags from clicks and
      disable click propagation only during intentional scrolling
generator:
  version: 1
covers:
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
  - symbol: CarouselProps
    kind: interface
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L11-L20'
  - symbol: Carousel
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L22-L125'
  - symbol: update
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L42-L43'
  - symbol: onPointerDown
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L59-L63'
  - symbol: onPointerMove
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L65-L77'
  - symbol: onPointerEnd
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L79-L82'
---

<!-- context:generated:start -->

## Summary

Threshold-based gesture classification distinguishing intentional drags from incidental pointer movement via distance thresholds (DRAG_THRESHOLD_PX for carousel, implicit threshold checking in timeline). Carousel applies this to preserve clickability—if pointer movement is below threshold, events propagate normally; above threshold, click propagation is disabled via onClickCapture. Timeline applies similar logic to ignore spurious mousemove events without prior mousedown, preventing false drag detection.

## Related

- implements [[carousel-responsive-overflow-detection]] — Carousel uses DRAG_THRESHOLD_PX to distinguish drags from clicks and disable click propagation only during intentional scrolling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
