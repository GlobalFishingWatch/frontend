---
name: Shader-Based Time-Range Highlighting
slug: shader-based-time-range-highlighting
type: concept
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts
    hash: cd06d813c6ea86fa285d043a6afacdf8f8a204b8fbc61f9e7e86204af01f45e2
sources_digest: 43ba6787e4951e3762087237bdedd95af105118802f6c788b55d59eafea32f7c
links: []
generator:
  version: 1
covers:
  - symbol: _FourwingsPositionsIconLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts:L5-L24
  - symbol: FourwingsPositionsIconLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts:L26-L27
  - symbol: FourwingsPositionsIconLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts:L60-L118
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts:L67-L73
  - symbol: getShaders
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts:L75-L104
  - symbol: draw
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts:L106-L117
---

<!-- context:generated:start -->

## Summary

GPU-side highlighting logic for time-range filtering: FourwingsPositionsIconLayer injects custom GLSL with per-instance time data (instanceStime, relative to base epoch) and highlight flags; fragment shader's DECKGL_FILTER_COLOR hook checks if position time falls within global highlightTimeStart/highlightTimeEnd bounds, applying dimOpacity multiplier for non-highlighted positions. Avoids expensive client-side time checks.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
