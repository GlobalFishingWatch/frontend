---
name: Deck.gl Composite Layer Pattern
slug: deck-gl-composite-layer-pattern
type: concept
sources:
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.ts
    hash: aae15372c844228889be6d7a92ff8f966ea7c5634bdc3cf6fa7f89baea60c375
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts
    hash: 15fe6898e5bafbbcb54684720d658f1c5d4ad880dabaee57107ec06442ec6a48
  - path: libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts
    hash: 359f3d207f21f9c16d9093639e0fa4319ebeecc685746629ee18e0636c839ded
  - path: libs/deck-layers/src/layers/graticules/GraticulesLayer.ts
    hash: d60c36636fc638ad79ea850e7ce6bbfa97701ffbe37086809cdd998669b384e7
  - path: libs/deck-layers/src/layers/labels/LabelLayer.ts
    hash: 35bba921cf9898b06b831b8955ff9c280b996e0b140b907167c769632a708393
  - path: libs/deck-layers/src/layers/polygons/PolygonsLayer.ts
    hash: 054eedc44fc09b17c72c088997c3dc1252cd819dadf0f5ca23178109964f926d
sources_digest: f721288213880ebc27073b1f55f32964e5e506c13e4a6a32c23562e9014c0fca
links: []
generator:
  version: 1
covers:
  - symbol: FourwingsHeatmapLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.ts:L30-L314
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.ts:L223-L309
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.ts:L311-L313
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
  - symbol: FourwingsVectorsTileLayerState
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L52-L59
  - symbol: _FourwingsVectorsTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L63-L72
  - symbol: FourwingsVectorsTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L75-L76
  - symbol: FourwingsVectorsTileLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L85-L501
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L93-L110
  - symbol: _getHighlightedFeatures
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L112-L114
  - symbol: setHighlightedFeatures
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L116-L121
  - symbol: cacheHash
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L123-L127
  - symbol: debounceTime
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L129-L131
  - symbol: viewportLoaded
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L133-L135
  - symbol: getError
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L137-L139
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L327-L363
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L370-L413
  - symbol: getLayerInstance
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L415-L418
  - symbol: getFourwingsLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L420-L422
  - symbol: getAggregationOperation
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L424-L426
  - symbol: getTilesData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L428-L444
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L446-L448
  - symbol: getViewportData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts:L455-L469
  - symbol: GraticulesLayer
    kind: class
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L29-L136'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L36-L42'
  - symbol: shouldUpdateState
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L44-L51'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L53-L57'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/graticules/GraticulesLayer.ts:L95-L135'
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
  - symbol: PolygonsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L38-L43'
  - symbol: PolygonsLayer
    kind: class
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L45-L246'
  - symbol: constructor
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L52-L61'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L63-L69'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L71-L99'
  - symbol: finalizeState
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L101-L107'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L109-L111'
  - symbol: getFillColor
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L127-L135'
  - symbol: getHighlightLineWidth
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L137-L145'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L147-L149'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L151-L238'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/polygons/PolygonsLayer.ts:L240-L245'
---

<!-- context:generated:start -->

## Summary

Architectural pattern used across all multi-layer components: extend CompositeLayer, manage child layer instances in renderLayers(), use updateTriggers for prop-driven re-computation, and maintain state via updateState. Enables composability of deck.gl's PathLayer, TextLayer, SolidPolygonLayer, etc. while centralizing data logic.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
