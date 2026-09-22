---
name: Responsive Overflow Detection Pattern
slug: responsive-overflow-detection-pattern
type: concept
sources:
  - path: libs/ui-components/src/carousel/Carousel.tsx
    hash: 969a4a944bf8edf04e8ffe8161ca1fe9eb7fe328c642d4350060572fffe2d68e
  - path: libs/ui-components/src/choice/Choice.tsx
    hash: ee6dc7b8e6662744c189490462b56a5355fa8ea50262ed044d60c4e503abf2ae
sources_digest: be92f1780651efd9cb26850744e4b693a125584fb81b025e531c2b7eb0f3af5a
links: []
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
  - symbol: ChoiceOption
    kind: type
    at: 'libs/ui-components/src/choice/Choice.tsx:L13-L13'
  - symbol: ChoiceProps
    kind: interface
    at: 'libs/ui-components/src/choice/Choice.tsx:L15-L26'
  - symbol: Choice
    kind: function
    at: 'libs/ui-components/src/choice/Choice.tsx:L28-L176'
  - symbol: onOptionClickHandle
    kind: function
    at: 'libs/ui-components/src/choice/Choice.tsx:L81-L86'
---

<!-- context:generated:start -->

## Summary

ResizeObserver-based pattern for detecting when content overflows its container, enabling responsive fallback behavior. Carousel applies this to show/hide fade overlay indicating hidden content; Choice applies this to fall back to Select dropdown when button group exceeds available space. The pattern measures both container and children dimensions, accounts for async content loads (e.g., images), and recomputes whenever layout changes.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
