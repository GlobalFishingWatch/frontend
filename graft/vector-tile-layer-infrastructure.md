---
name: Vector Tile Layer Infrastructure
slug: vector-tile-layer-infrastructure
type: concept
sources:
  - path: libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts
    hash: 8805cc36ff7f4ed95b1d101be6115c29fc2c4ea784bda1d7f9b32efae53b02bc
  - path: libs/deck-layers/src/layers/context/ContextLayer.ts
    hash: 779dbb956bddd9bf461ae9e0423523799f62641defb7bb8d3f5b3afe67b385a2
  - path: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts
    hash: 5dffa1f1da704b6bcf79c4b17817cb92c55ea5af306a48d8c25e6217117c23bc
sources_digest: 030588700881a224e282ef6670b705f78a880bfa4070b7d1d1b3c472a988014e
links:
  - to: deck-gl-core-integration
    relation: implements
    description: >-
      Implements deck.gl's TileLayer, CompositeLayer abstractions and uses
      Tile2DHeader for viewport-aware tile management
generator:
  version: 1
covers:
  - symbol: _ContextLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L36-L36
  - symbol: isIndexContour
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L58-L58
  - symbol: _BathymetryContourPathLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L60-L70
  - symbol: BathymetryContourPathLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L92-L93
  - symbol: BathymetryContourPathLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L108-L176
  - symbol: getShaders
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L115-L144
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L146-L155
  - symbol: draw
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L157-L175
  - symbol: isBelowSeaLevel
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L178-L178
  - symbol: BathymetryPathFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L180-L180
  - symbol: isLabelFeature
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L182-L183
  - symbol: BathymetryContourLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L191-L405
  - symbol: shouldUpdateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L204-L206
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L208-L210
  - symbol: setHighlightedFeatures
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L299-L301
  - symbol: finalizeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L303-L306
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L320-L404
  - symbol: matchesDepth
    kind: function
    at: >-
      libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts:L329-L330
  - symbol: _ContextLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L51-L51'
  - symbol: ContextLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L53-L55'
  - symbol: ContextLayer
    kind: class
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L63-L407'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L71-L76'
  - symbol: filtersHash
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L78-L86'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L88-L90'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L92-L94'
  - symbol: getHighlightLineWidth
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L96-L114'
  - symbol: getFillColor
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L116-L126'
  - symbol: getDashArray
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L128-L130'
  - symbol: getRenderedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L176-L212'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L214-L399'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L401-L406'
  - symbol: FourwingsFootprintTileLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L54-L307
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L60-L71
  - symbol: cacheHash
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L73-L75
  - symbol: debounceTime
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L77-L79
  - symbol: viewportLoaded
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L81-L83
  - symbol: getError
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L85-L87
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L171-L189
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L191-L220
  - symbol: getLayerInstance
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L222-L225
  - symbol: getTilesData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L227-L243
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L245-L247
  - symbol: getIsPositionsAvailable
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L249-L264
  - symbol: getViewportData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L266-L280
  - symbol: getFourwingsLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L282-L284
---

<!-- context:generated:start -->

## Summary

Foundational architecture for deck.gl-based tiled rendering. Handles tile fetching, coordinate systems (web-mercator to WGS84), multi-layer sublayer composition, and viewport synchronization. Supports both MVT (Mapbox Vector Tile) and PMTiles formats via format-specific loaders. Manages tile lifecycle including caching, abort signaling for cancelled requests, and lazy data fetching.

## Related

- implements [[deck-gl-core-integration]] — Implements deck.gl's TileLayer, CompositeLayer abstractions and uses Tile2DHeader for viewport-aware tile management

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
