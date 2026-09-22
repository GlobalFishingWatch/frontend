---
name: Deck.gl Core Integration
slug: deck-gl-core-integration
type: concept
sources:
  - path: libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts
    hash: abdbaa66deb665511f075848a521f958d31eb8f29f84b3e47861798ad22bcce2
  - path: libs/deck-layers/src/layers/context/context.types.ts
    hash: deb35f707652c02c7bc1fae64184a1451b2f117ec18787c3b4c17584af1a930e
  - path: libs/deck-layers/src/layers/draw/draw.types.ts
    hash: ea69aa5995a8f16537f48c3183e4067cd687a1a2d49aae093abbb75410c4424b
  - path: libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts
    hash: b48d0bfc239f82809d6cc85b70aad6a4fc3e4dfa4a12ef3aa0f1e5b4c9584611
  - path: libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts
    hash: 05df067b4146356879f70d595a88a01422bd73035b24e58b36c30c52e041a603
sources_digest: 566c40cdd7578a3535b8b14edf2652b45f7750f1145a3371f1813d5401fd7c60
links: []
generator:
  version: 1
covers:
  - symbol: BathymetryContourLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L6-L11
  - symbol: BathymetryContourFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L12-L12
  - symbol: BathymetryLabelFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L13-L20
  - symbol: BathymetryTileFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L22-L22
  - symbol: BathymetryContourPickingObject
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L24-L26
  - symbol: BathymetryContourPickingInfo
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/bathymetry-contour.types.ts:L28-L28
  - symbol: ContextSublayerCallbackParams
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L9-L12'
  - symbol: ContextLayerId
    kind: enum
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L14-L27'
  - symbol: ContextLayerConfigFilter
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L29-L29'
  - symbol: ContextSubLayerConfig
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L30-L40'
  - symbol: ContextLayerConfig
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L41-L50'
  - symbol: ContextLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L52-L56'
  - symbol: ContextFeatureBaseProperties
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L58-L66'
  - symbol: ContextFeatureProperties
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L68-L70'
  - symbol: ContextFeature
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L72-L75'
  - symbol: ContextPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L77-L77'
  - symbol: ContextPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L79-L79'
  - symbol: DrawFeatureProperties
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L6-L8'
  - symbol: DrawFeature
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L10-L10'
  - symbol: DrawPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L12-L12'
  - symbol: DrawPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L13-L13'
  - symbol: EditHandleType
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L17-L18'
  - symbol: EditHandleFeature
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L20-L29'
  - symbol: HighlightedTimeMillis
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L31-L31'
  - symbol: FourwingsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L33-L37'
  - symbol: FourwingsColorRamp
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L39-L42'
  - symbol: FourwingsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L44-L55'
  - symbol: AnyFourwingsLayer
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L57-L61'
  - symbol: FourwingsLayer
    kind: class
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L68-L254'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L73-L78'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L80-L82'
  - symbol: isHeatmapVisualizationMode
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L84-L90'
  - symbol: debounceTime
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L92-L94'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L96-L98'
  - symbol: _getHighlightTimes
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L100-L105'
  - symbol: setHighlightedTime
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L107-L115'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L117-L161'
  - symbol: setHighlightedVessel
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L163-L168'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L170-L175'
  - symbol: getData
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L177-L179'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L181-L183'
  - symbol: getIsPositionsAvailable
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L185-L194'
  - symbol: getInterval
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L196-L201'
  - symbol: getVisualizationMode
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L203-L205'
  - symbol: getAggregationOperation
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L207-L209'
  - symbol: getChunk
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L211-L216'
  - symbol: getViewportData
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L218-L220'
  - symbol: getMode
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L222-L224'
  - symbol: getResolution
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L226-L228'
  - symbol: getZoomOffset
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L230-L237'
  - symbol: getLayer
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L239-L241'
  - symbol: getColorScale
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L243-L245'
  - symbol: getColorByValue
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L247-L249'
  - symbol: getFourwingsLayers
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L251-L253'
  - symbol: FourwingsClusterEventType
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L14-L20
  - symbol: FourwingsClusterMode
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L22-L22
  - symbol: FourwingsClustersLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L24-L35
  - symbol: FourwingsClusterProperties
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L37-L47
  - symbol: FourwingsClusterFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L48-L48
  - symbol: FourwingsPointFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L50-L50
  - symbol: FourwingsClusterPickingObject
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L51-L61
  - symbol: FourwingsClusterPickingInfo
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L63-L66
---

<!-- context:generated:start -->

## Summary

Unified foundation for all layer implementations in the deck-layers library. Provides CompositeLayer abstraction for multi-layer rendering, PickingInfo/PickingObject for interaction data, DeckLayerProps and DeckPickingObject type contracts, and shader injection patterns for GPU-accelerated rendering. All layers extend standard deck.gl layer classes and respect layer group ordering via getLayerGroupOffset.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
