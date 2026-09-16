---
name: Dynamic Color Ramping
slug: dynamic-color-ramping
type: concept
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts
    hash: b2a4a8a976f5007be6e5b22404ebd7a44bbe6bddf29ace08ba36b111a0a5cc63
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts
    hash: 9043142a38845c9b0f8564f6c1c89783b546e770046ef861dd08b499113109ca
  - path: libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts
    hash: 359f3d207f21f9c16d9093639e0fa4319ebeecc685746629ee18e0636c839ded
sources_digest: 4a00175978a80296083d46fcbd9a8bb964188aab048306a96a917f01cec6d312
links:
  - to: temporal-aggregation-caching
    relation: depends_on
    description: >-
      Color domain calculation operates on temporally consistent data slices
      determined by getIntervalFrames and frame window parameters
generator:
  version: 1
covers:
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

Pattern for computing color scales from data domain statistics: compute color domain (min/max/percentiles), generate d3-scale linear scales, apply color ramps via interpolation. Handles outlier removal via removeOutliers, bivariate modes via nested arrays, and rampDirty flag to track when scales need recalculation. Static layers use synthetic EMPTY_STATIC_CHUNK (frames 0–1) since aggregated data has no temporal dimension.

## Related

- depends on [[temporal-aggregation-caching]] — Color domain calculation operates on temporally consistent data slices determined by getIntervalFrames and frame window parameters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
