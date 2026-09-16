---
name: Temporal Aggregation & Caching
slug: temporal-aggregation-caching
type: concept
sources:
  - path: libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts
    hash: 5899eda2f82abd0754284cbf8fa18b4e26c127910d1bf4acc688956306f226d6
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts
    hash: 9043142a38845c9b0f8564f6c1c89783b546e770046ef861dd08b499113109ca
  - path: libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts
    hash: 359f3d207f21f9c16d9093639e0fa4319ebeecc685746629ee18e0636c839ded
sources_digest: 89512e5598fad203b0590e93f8adec7896a2f232d30259e06f823b42bb000184
links:
  - to: null-vs-zero-distinction
    relation: depends_on
    description: >-
      Aggregation must preserve undefined (no data) vs 0 (measured zero);
      failure to distinguish causes incorrect ramp extremes and false zero
      visualization
generator:
  version: 1
covers:
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
  - symbol: aggregateSublayerValues
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L43-L71
  - symbol: getCellValuesFrameRange
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L73-L90
  - symbol: sliceCellValues
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L92-L113
  - symbol: aggregateCell
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L118-L148
  - symbol: compareCell
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L150-L170
  - symbol: stringHash
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L172-L174
  - symbol: getURLFromTemplate
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L176-L204
  - symbol: GetDataUrlParams
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L206-L219
  - symbol: getTimeResolved
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L221-L232
  - symbol: getDataUrl
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L234-L288
  - symbol: Bounds
    kind: interface
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L290-L295
  - symbol: filterCellsByBounds
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L297-L319
  - symbol: getFourwingsChunk
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L323-L336
  - symbol: FourwingsIntervalFrames
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L338-L343
  - symbol: getIntervalFrames
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L348-L382
  - symbol: isSublayerValueVisible
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L384-L397
  - symbol: getSublayersVisibleValuesHash
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L399-L403
  - symbol: filterCells
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L405-L410
  - symbol: getFourwingsColorDomain
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L412-L466
  - symbol: getResolutionByVisualizationMode
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L468-L477
  - symbol: getVisualizationModeByResolution
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L479-L486
  - symbol: getZoomOffsetByResolution
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L488-L495
  - symbol: getTileDataCache
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts:L497-L542
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
---

<!-- context:generated:start -->

## Summary

Design pattern for efficiently computing aggregated values across time ranges using frame slicing, internal cache memoization, and deterministic caching with cache keys. Distinguishes temporal aggregation flag (bypasses chunk buffering) from intervalCacheMode ('DATE', 'HOUR', 'NONE') which controls API cache key precision.

## Related

- depends on [[null-vs-zero-distinction]] — Aggregation must preserve undefined (no data) vs 0 (measured zero); failure to distinguish causes incorrect ramp extremes and false zero visualization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
