---
name: Fourwings Heatmap Layer
slug: fourwings-heatmap-layer
type: system
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.spec.ts
    hash: 260ea232b0c52c9634617ddc807993e657cb6ac1a2a85d1abbd18b431c8f6c4f
  - path: libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts
    hash: 2e7b196e74bc924301c47286acc074bd02d916fb8ef6db0aaaab215b1e291d5f
  - path: libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts
    hash: 09d4745f9675be5b7a1ddd980c9de0afe7bd20bdfca37b1ea8f7c488ae89eb87
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.spec.ts
    hash: 0efd2fb72cc35910cb1b9b177991a6e2bec7e2c36c4d3e0967f091d5d22c2f9d
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.ts
    hash: aae15372c844228889be6d7a92ff8f966ea7c5634bdc3cf6fa7f89baea60c375
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.spec.ts
    hash: 9298062bb83ce3964beffec7044e618564ba2ea6928ecb37c68ccf3db9b85f94
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts
    hash: b2a4a8a976f5007be6e5b22404ebd7a44bbe6bddf29ace08ba36b111a0a5cc63
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.spec.ts
    hash: 4f9a249a2de5d476888d5df27adbb1b67aed38fff531ce8ecad4e2f85d041690
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts
    hash: 9043142a38845c9b0f8564f6c1c89783b546e770046ef861dd08b499113109ca
sources_digest: 87e146e97a83f7d6b584389118f3a27c89ea2018ddc4332b75820a50d2077950
links:
  - to: binary-tile-data-fetching
    relation: produces
    description: >-
      Fetches binary tile buffers via GFWAPI and parses them with
      FourwingsLoader into FourwingsFeature arrays; extracts
      scale/offset/dimension metadata from response headers
  - to: comparison-mode-rendering
    relation: implements
    description: >-
      Supports Compare (stacked sublayers), TimeCompare (period difference), and
      Bivariate (screen-blended multi-sublayer) color strategies
  - to: deck-gl-composite-layer-pattern
    relation: uses
    description: >-
      Extends CompositeLayer, composes SolidPolygonLayer for cells and PathLayer
      for highlights; uses updateTriggers for prop-driven re-computation
  - to: deck-gl-core-integration
    relation: uses
    description: >-
      Integrates with deck.gl tile layer infrastructure and uses d3-scale for
      color scale functions
  - to: fourwings-data-infrastructure
    relation: depends_on
    description: >-
      Depends on deck-loaders FourwingsLoader and interval metadata; uses
      Promise.allSettled for per-sublayer fault tolerance
  - to: fourwings-heatmap-utilities
    relation: uses
    description: >-
      Layer classes depend on aggregateCell, compareCell, filterCells, and color
      domain calculation utilities for temporal aggregation and value filtering
  - to: per-sublayer-visibility-filtering
    relation: implements
    description: >-
      Each sublayer has independent minVisibleValue/maxVisibleValue bounds;
      out-of-range cells render as EMPTY_CELL_COLOR sentinel
  - to: temporal-aggregation-caching
    relation: implements
    description: >-
      Implements temporal aggregation through frame range slicing and cache key
      generation based on sublayer visibility and time ranges
generator:
  version: 1
covers:
  - symbol: colorObj
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.spec.ts:L12-L12
  - symbol: makeLayer
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.spec.ts:L35-L41
  - symbol: feature
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.spec.ts:L43-L50
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
  - symbol: colorObj
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.spec.ts:L6-L6
  - symbol: makeLayer
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.spec.ts:L24-L36
  - symbol: staticFeature
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.spec.ts:L39-L47
  - symbol: FourwingsHeatmapStaticLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L71-L319
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L76-L87
  - symbol: cacheHash
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L89-L95
  - symbol: debounceTime
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L97-L99
  - symbol: viewportLoaded
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L101-L103
  - symbol: _getState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L105-L107
  - symbol: getError
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L122-L124
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L206-L215
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L217-L257
  - symbol: getLayerInstance
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L259-L262
  - symbol: getTilesData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L264-L279
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L281-L283
  - symbol: getViewportData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L285-L299
  - symbol: getFourwingsLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts:L301-L303
  - symbol: makeLayer
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.spec.ts:L36-L51
  - symbol: feature
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.spec.ts:L59-L66
  - symbol: FourwingsHeatmapTileLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L88-L785
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L94-L114
  - symbol: finalizeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L116-L119
  - symbol: _clearPendingTilesCacheUpdate
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L121-L127
  - symbol: cacheHash
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L129-L135
  - symbol: debounceTime
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L137-L139
  - symbol: viewportLoaded
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L141-L143
  - symbol: getError
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L145-L147
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L544-L627
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L629-L667
  - symbol: getLayerInstance
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L669-L672
  - symbol: getTilesData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L674-L690
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L692-L694
  - symbol: getIsPositionsAvailable
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L696-L711
  - symbol: getViewportData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L713-L727
  - symbol: getFourwingsLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts:L729-L735
  - symbol: responseWith
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.spec.ts:L5-L5
  - symbol: FetchFourwingsTileDataParams
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L23-L41
  - symbol: FourwingsTileHeaders
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L43-L49
  - symbol: readNumberHeader
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L51-L58
  - symbol: readFourwingsHeaders
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L60-L87
  - symbol: FourwingsTileBuffers
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L89-L93
  - symbol: fetchFourwingsTileBuffers
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L98-L162
  - symbol: getBuffer
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L116-L138
  - symbol: fetchFourwingsTileData
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts:L165-L231
  - symbol: FourwingsChunk
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L25-L32
  - symbol: FourwingsAggregationOperation
    kind: enum
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L34-L38
  - symbol: FourwingsComparisonMode
    kind: enum
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L40-L47
  - symbol: ColorDomain
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L49-L49
  - symbol: ColorRange
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L50-L50
  - symbol: SublayerColorRanges
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L51-L51
  - symbol: FourwingsHeatmapPickingObject
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L53-L65
  - symbol: FourwingsHeatmapPickingInfo
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L66-L66
  - symbol: AggregateCellParams
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L68-L75
  - symbol: CompareCellParams
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L77-L80
  - symbol: FourwingsHeatmapResolution
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L82-L82
  - symbol: FourwingsHeatmapTileData
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L83-L83
  - symbol: FourwingsIntervalCacheMode
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L84-L84
  - symbol: _FourwingsHeatmapTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L86-L102
  - symbol: FourwingsHeatmapTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L104-L105
  - symbol: FourwingsHeatmapTilesCache
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L107-L116
  - symbol: FourwinsTileLayerScale
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L118-L118
  - symbol: FourwingsTileLayerState
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L119-L129
  - symbol: FourwingsHeatmapLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L131-L139
  - symbol: FourwingsVectorsLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L141-L151
  - symbol: _FourwingsHeatmapStaticLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L153-L153
  - symbol: FourwingsHeatmapStaticLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts:L155-L156
---

<!-- context:generated:start -->

## Summary

Visualizes spatiotemporal fishing activity data as colored grid cells with dynamic heatmap rendering from web-mercator tiles. Supports multiple comparison modes (compare, bivariate, timeCompare) and aggregation operations (sum, avg, avgDegrees). Implements tile caching (256MB cap), header extraction from HTTP responses, and coordinate system handling for efficient large-scale geospatial datasets.

## Related

- produces [[binary-tile-data-fetching]] — Fetches binary tile buffers via GFWAPI and parses them with FourwingsLoader into FourwingsFeature arrays; extracts scale/offset/dimension metadata from response headers
- implements [[comparison-mode-rendering]] — Supports Compare (stacked sublayers), TimeCompare (period difference), and Bivariate (screen-blended multi-sublayer) color strategies
- uses [[deck-gl-composite-layer-pattern]] — Extends CompositeLayer, composes SolidPolygonLayer for cells and PathLayer for highlights; uses updateTriggers for prop-driven re-computation
- uses [[deck-gl-core-integration]] — Integrates with deck.gl tile layer infrastructure and uses d3-scale for color scale functions
- depends on [[fourwings-data-infrastructure]] — Depends on deck-loaders FourwingsLoader and interval metadata; uses Promise.allSettled for per-sublayer fault tolerance
- uses [[fourwings-heatmap-utilities]] — Layer classes depend on aggregateCell, compareCell, filterCells, and color domain calculation utilities for temporal aggregation and value filtering
- implements [[per-sublayer-visibility-filtering]] — Each sublayer has independent minVisibleValue/maxVisibleValue bounds; out-of-range cells render as EMPTY_CELL_COLOR sentinel
- implements [[temporal-aggregation-caching]] — Implements temporal aggregation through frame range slicing and cache key generation based on sublayer visibility and time ranges

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
