---
name: Fourwings Vectors Layer
slug: fourwings-vectors-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsLayer.ts
    hash: 5a3a8576f283b864d754c77c465e0adef2a514d2a3260370856d8763932c1d29
  - path: libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts
    hash: 359f3d207f21f9c16d9093639e0fa4319ebeecc685746629ee18e0636c839ded
  - path: libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts
    hash: 76892848468f72300a7f18830f36976c94f933d9c5625f955322c89803253424
sources_digest: ad1b971ae60ced448607eb1cba2e63ca77d70b54e0b8488da457a8d910344611
links:
  - to: deck-gl-composite-layer-pattern
    relation: uses
    description: >-
      Extends CompositeLayer, wraps TileLayer for data management, composes
      VectorsLayer (arrows) and optional debug/highlight layers
  - to: dynamic-color-ramping
    relation: implements
    description: >-
      Computes maxVelocity from cell data, updates scales via d3-scale, and
      applies velocity-based color interpolation; velocity=0 is filtered in
      shaders
  - to: per-sublayer-visibility-filtering
    relation: implements
    description: >-
      isSublayerValueVisible filters out invisible sublayers during picking;
      per-layer visibility thresholds control whether vectors render
  - to: temporal-aggregation-caching
    relation: uses
    description: >-
      Uses aggregateSublayerValues for temporal aggregation of u/v vector
      components; getTileDataCache and getDataUrl for cache management
generator:
  version: 1
covers:
  - symbol: FourwingsVectorsLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsLayer.ts:L34-L302
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsLayer.ts:L40-L44
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsLayer.ts:L173-L297
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsLayer.ts:L299-L301
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
  - symbol: _VectorsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts:L6-L11'
  - symbol: VectorsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts:L13-L14'
  - symbol: VectorsLayer
    kind: class
    at: 'libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts:L38-L188'
  - symbol: _getModel
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts:L45-L76'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts:L78-L99'
  - symbol: getShaders
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts:L101-L173'
  - symbol: draw
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts:L175-L187'
---

<!-- context:generated:start -->

## Summary

Composite deck.gl layer for rendering vector field data (ocean currents, wind) as arrow glyphs. Orchestrates tile loading, temporal aggregation via aggregateSublayerValues, dynamic arrow sizing by cell dimensions and latitude conversion, and velocity-based color ramping with outlier removal.

## Related

- uses [[deck-gl-composite-layer-pattern]] — Extends CompositeLayer, wraps TileLayer for data management, composes VectorsLayer (arrows) and optional debug/highlight layers
- implements [[dynamic-color-ramping]] — Computes maxVelocity from cell data, updates scales via d3-scale, and applies velocity-based color interpolation; velocity=0 is filtered in shaders
- implements [[per-sublayer-visibility-filtering]] — isSublayerValueVisible filters out invisible sublayers during picking; per-layer visibility thresholds control whether vectors render
- uses [[temporal-aggregation-caching]] — Uses aggregateSublayerValues for temporal aggregation of u/v vector components; getTileDataCache and getDataUrl for cache management

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
