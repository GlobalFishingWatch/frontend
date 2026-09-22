---
name: Fourwings Positions Layer
slug: fourwings-positions-layer
type: system
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.types.ts
    hash: 16d892b82e697c378ecdaea055ca01a7ff478789ebf24e6653065afa75ca87f8
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.spec.ts
    hash: e469390836f2c6ac28be4295775e77f41b4a43d2a31facff10f06fea0c5ebb7e
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts
    hash: a5b24176dd792a4dfcc7f0c29d3740536f2ca0eb007d00a174c5cef045b21142
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts
    hash: cd06d813c6ea86fa285d043a6afacdf8f8a204b8fbc61f9e7e86204af01f45e2
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.spec.ts
    hash: ed0f7a8b005cab40d1bc5ea225aba6389216f6a66930819e08652d5f39a96d15
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts
    hash: 15fe6898e5bafbbcb54684720d658f1c5d4ad880dabaee57107ec06442ec6a48
sources_digest: 3f7e988cdf61bc846b0becd6bd2b2b9541488ad9e08070ee8d7861c01b6178a0
links:
  - to: deck-gl-composite-layer-pattern
    relation: uses
    description: >-
      Extends CompositeLayer, composes MVTLayer (data fetch),
      FourwingsPositionsIconLayer, PathLayer (tracks), and LabelLayer (vessel
      IDs)
  - to: shader-based-time-range-highlighting
    relation: implements
    description: >-
      FourwingsPositionsIconLayer injects GLSL with per-instance time data and
      highlight flags; fragment shader checks if position time falls within
      highlight range for opacity modulation
  - to: vessel-track-reconstruction
    relation: implements
    description: >-
      getVesselTracks groups positions by vessel ID, orders chronologically,
      segments by POSITIONS_TRACK_MAX_GAP_SECONDS, and unwraps longitude for
      antimeridian crossings
  - to: viewport-deduplication
    relation: implements
    description: >-
      hasSameTileContents memoizes tile loading to prevent redundant state
      updates and attribute re-uploads that cause visual jitter when tiles are
      reloaded
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
  - symbol: _FourwingsPositionsTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.types.ts:L15-L21
  - symbol: FourwingsPositionsTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.types.ts:L23-L24
  - symbol: FourwingsPositionsPickingObject
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.types.ts:L26-L33
  - symbol: FourwingsPositionsPickingInfo
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.types.ts:L34-L34
  - symbol: pos
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.spec.ts:L7-L18
  - symbol: upperFirst
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L8-L10
  - symbol: cleanVesselShipname
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L12-L17
  - symbol: getIsActivityPositionMatched
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L19-L24
  - symbol: getIsDetectionsPositionMatched
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L26-L31
  - symbol: getPositionBearing
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L33-L35
  - symbol: getIsIdInFilterIds
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L39-L47
  - symbol: getIsFeatureInFilterIds
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L49-L51
  - symbol: FourwingsPositionsVesselTrack
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L53-L58
  - symbol: getTrackPath
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L60-L78
  - symbol: getVesselTracks
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L80-L127
  - symbol: filteredPositionsByViewport
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L129-L142
---

<!-- context:generated:start -->

## Summary

Composite deck.gl layer for rendering vessel position data including tracks and icons with time-range highlighting, dimming effects, and interactive picking. Fetches MVT tiles from GFWAPI, reconstructs vessel paths via antimeridian-aware track segmentation, and applies shader-based highlighting by temporal intervals.

## Related

- uses [[deck-gl-composite-layer-pattern]] — Extends CompositeLayer, composes MVTLayer (data fetch), FourwingsPositionsIconLayer, PathLayer (tracks), and LabelLayer (vessel IDs)
- implements [[shader-based-time-range-highlighting]] — FourwingsPositionsIconLayer injects GLSL with per-instance time data and highlight flags; fragment shader checks if position time falls within highlight range for opacity modulation
- implements [[vessel-track-reconstruction]] — getVesselTracks groups positions by vessel ID, orders chronologically, segments by POSITIONS_TRACK_MAX_GAP_SECONDS, and unwraps longitude for antimeridian crossings
- implements [[viewport-deduplication]] — hasSameTileContents memoizes tile loading to prevent redundant state updates and attribute re-uploads that cause visual jitter when tiles are reloaded

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
