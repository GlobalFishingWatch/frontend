---
name: Per-Sublayer Visibility Filtering
slug: per-sublayer-visibility-filtering
type: concept
sources:
  - path: libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts
    hash: 5899eda2f82abd0754284cbf8fa18b4e26c127910d1bf4acc688956306f226d6
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.ts
    hash: aae15372c844228889be6d7a92ff8f966ea7c5634bdc3cf6fa7f89baea60c375
  - path: libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsLayer.ts
    hash: 5a3a8576f283b864d754c77c465e0adef2a514d2a3260370856d8763932c1d29
sources_digest: 4cabba08d4e7318f661fc0e3a4053b6e5e0d89885f7c8d42ffe04c455de9b0f4
links:
  - to: null-vs-zero-distinction
    relation: depends_on
    description: >-
      Visibility check must treat undefined as always invisible, while 0 is
      potentially visible if within range; preserves no-data distinctions
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
---

<!-- context:generated:start -->

## Summary

Design constraint where visibility thresholds (minVisibleValue, maxVisibleValue) are attached to individual sublayer objects rather than the composite layer, enabling multi-source merged heatmaps. Out-of-range cells render as EMPTY_CELL_COLOR sentinel. The isSublayerValueVisible function checks range membership and distinguishes measured zeros from missing data.

## Related

- depends on [[null-vs-zero-distinction]] — Visibility check must treat undefined as always invisible, while 0 is potentially visible if within range; preserves no-data distinctions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
