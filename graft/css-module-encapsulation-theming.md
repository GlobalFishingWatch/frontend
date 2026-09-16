---
name: CSS Module Encapsulation & Theming
slug: css-module-encapsulation-theming
type: concept
sources:
  - path: libs/ui-components/src/carousel/Carousel.tsx
    hash: 969a4a944bf8edf04e8ffe8161ca1fe9eb7fe328c642d4350060572fffe2d68e
  - path: libs/ui-components/src/color-bar/ColorBar.tsx
    hash: 77f5428554b3376b068a5e0d14475875665d93a59d00a041810d9bb357fc6567
  - path: libs/ui-components/src/icon-button/IconButton.tsx
    hash: 632fe4c391aaaaf58f6d1fd5c614122f9c51aa979cb80a17e241d484900d404b
sources_digest: 7b46ee2f439b8d6b8d9dc8a0fe1b82804beffc8fb92575167842c440cf270090
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
  - symbol: ColorBarProps
    kind: interface
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L17-L25'
  - symbol: ColorBar
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L27-L113'
  - symbol: toggleColorMode
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L48-L50'
  - symbol: handleHueBarSelection
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L52-L57'
  - symbol: IconButtonType
    kind: type
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L15-L23'
  - symbol: IconButtonSize
    kind: type
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L24-L24'
  - symbol: IconButtonProps
    kind: interface
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L26-L43'
  - symbol: IconButtonComponent
    kind: function
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L50-L115'
---

<!-- context:generated:start -->

## Summary

Consistent pattern across ui-components library using CSS modules for scoped styling with classnames (cx) utility for conditional class composition. Components like ColorBar, IconButton, and Carousel read CSS custom properties at runtime (e.g., --color-danger-red) to support dynamic theming and runtime color selection without tight coupling to hardcoded values. CSS modules prevent style leaks and enable safe refactoring.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
