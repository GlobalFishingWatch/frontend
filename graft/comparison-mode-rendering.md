---
name: Comparison Mode Rendering
slug: comparison-mode-rendering
type: concept
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.spec.ts
    hash: 0efd2fb72cc35910cb1b9b177991a6e2bec7e2c36c4d3e0967f091d5d22c2f9d
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.ts
    hash: aae15372c844228889be6d7a92ff8f966ea7c5634bdc3cf6fa7f89baea60c375
  - path: libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts
    hash: 9043142a38845c9b0f8564f6c1c89783b546e770046ef861dd08b499113109ca
sources_digest: 70ee7a42211e499e5a1bb27a858fd4e17abec3acff79db91accfbe38622815f0
links:
  - to: per-sublayer-visibility-filtering
    relation: depends_on
    description: >-
      Each comparison mode respects per-sublayer visibility ranges; Compare mode
      filters invisible sublayers before aggregation
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
---

<!-- context:generated:start -->

## Summary

Three distinct color mapping strategies for multi-sublayer heatmaps: Compare (stacks sublayers, colors by highest aggregation), TimeCompare (highlights differences between two time periods), and Bivariate (screen-blends colors from two sublayers). Each mode requires distinct color domain computation, scale generation, and per-sublayer value filtering.

## Related

- depends on [[per-sublayer-visibility-filtering]] — Each comparison mode respects per-sublayer visibility ranges; Compare mode filters invisible sublayers before aggregation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
