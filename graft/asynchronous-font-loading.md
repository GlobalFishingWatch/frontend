---
name: Asynchronous Font Loading
slug: asynchronous-font-loading
type: concept
sources:
  - path: libs/deck-layers/src/layers/labels/LabelLayer.ts
    hash: 35bba921cf9898b06b831b8955ff9c280b996e0b140b907167c769632a708393
  - path: libs/deck-layers/src/layers/labels/labels.fonts.ts
    hash: e3a802fa808cbb88679f7c2ed70e2e3e89096a2c3a6b738d4b4c41fa4c824aab
sources_digest: fc32cd5627afd2e94e8d04a4e217f3e857a0ce0954b1ac49efc8293ec0d181ca
links: []
generator:
  version: 1
covers:
  - symbol: LabelLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/labels/LabelLayer.ts:L16-L18'
  - symbol: PaddedCharactersLayer
    kind: class
    at: 'libs/deck-layers/src/layers/labels/LabelLayer.ts:L24-L42'
  - symbol: getShaders
    kind: method
    at: 'libs/deck-layers/src/layers/labels/LabelLayer.ts:L27-L41'
  - symbol: LabelLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/labels/LabelLayer.ts:L44-L51'
  - symbol: LabelLayer
    kind: class
    at: 'libs/deck-layers/src/layers/labels/LabelLayer.ts:L53-L108'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/labels/LabelLayer.ts:L80-L90'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/labels/LabelLayer.ts:L92-L107'
  - symbol: loadDeckFont
    kind: function
    at: 'libs/deck-layers/src/layers/labels/labels.fonts.ts:L3-L24'
---

<!-- context:generated:start -->

## Summary

Deferred text rendering pattern where LabelLayer.renderLayers() returns empty until fontLoaded state becomes true. loadDeckFont() asynchronously loads Roboto from Google Fonts and registers via FontFace API; errors log to console but resolve the promise to prevent hanging. Enables graceful degradation in non-browser or offline scenarios.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
