---
name: Carousel & Responsive Overflow Detection
slug: carousel-responsive-overflow-detection
type: system
sources:
  - path: libs/ui-components/src/carousel/Carousel.tsx
    hash: 969a4a944bf8edf04e8ffe8161ca1fe9eb7fe328c642d4350060572fffe2d68e
sources_digest: 44b2d9e4b335e183cdbbadb707f3648d6f13e76ca162b63128c87e1362eb2810
links:
  - to: pointer-event-gesture-recognition-pattern
    relation: implements
    description: >-
      Applies DRAG_THRESHOLD_PX to distinguish drag gestures from clicks;
      disables click propagation via onClickCapture when dragging to prevent
      accidental navigation
generator:
  version: 1
covers:
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

Scrollable container with drag-to-scroll gesture support and visual indicators for overflow content. Uses ResizeObserver on both scroller and children to detect content changes (e.g., async image loads), CSS custom properties for responsive item sizing, and pointer event thresholds to distinguish intentional drags (above DRAG_THRESHOLD_PX) from incidental movement, preserving clickability of carousel items.

## Related

- implements [[pointer-event-gesture-recognition-pattern]] — Applies DRAG_THRESHOLD_PX to distinguish drag gestures from clicks; disables click propagation via onClickCapture when dragging to prevent accidental navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
