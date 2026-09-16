---
name: Viewport Deduplication
slug: viewport-deduplication
type: concept
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.spec.ts
    hash: ed0f7a8b005cab40d1bc5ea225aba6389216f6a66930819e08652d5f39a96d15
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts
    hash: 15fe6898e5bafbbcb54684720d658f1c5d4ad880dabaee57107ec06442ec6a48
sources_digest: 98da1e0a6cb3bcd6a9203debe0443a4b5562904a39d8767ea434d046e653e92c
links: []
generator:
  version: 1
covers:
  - symbol: makeLayer
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.spec.ts:L25-L42
  - symbol: position
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.spec.ts:L44-L47
  - symbol: makeTile
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.spec.ts:L49-L52
  - symbol: FourwingsPositionsTileLayerState
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L79-L92
  - symbol: hasSameTileContents
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L101-L103
  - symbol: FourwingsPositionsTileLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L105-L797
  - symbol: cacheHash
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L117-L122
  - symbol: positions
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L124-L131
  - symbol: debounceTime
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L133-L135
  - symbol: viewportLoaded
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L137-L139
  - symbol: dimOpacity
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L141-L143
  - symbol: timestampBase
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L145-L147
  - symbol: highlightTimeRange
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L150-L160
  - symbol: getError
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L162-L164
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L172-L187
  - symbol: updateViewportDirty
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L195-L205
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L207-L239
  - symbol: getLayerInstance
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L263-L266
  - symbol: _getColorRamp
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L268-L291
  - symbol: _hasHighlightedVessels
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L319-L321
  - symbol: _getIsHighlightedVessel
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L330-L338
  - symbol: showVesselTracks
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L410-L412
  - symbol: _getPositionProperties
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L519-L525
  - symbol: _getDataUrl
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L527-L567
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L569-L758
  - symbol: getIconAngle
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L581-L584
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L764-L766
  - symbol: getColorDomain
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L768-L770
  - symbol: getColorRange
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L772-L774
  - symbol: getColorScale
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L776-L783
  - symbol: getFourwingsLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L785-L787
  - symbol: setHighlightedVessel
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts:L789-L796
---

<!-- context:generated:start -->

## Summary

State preservation pattern to prevent redundant re-renders and attribute re-uploads when viewport tiles reload with identical content. hasSameTileContents checks reference equality of tile positions/tracks/scales; maintaining object identity prevents cascading re-renders and visual artifacts (e.g., label animation jitter). Viewport changes on every frame, so every onViewportLoad must compare state.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
