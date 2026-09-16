---
name: Null vs Zero Distinction
slug: null-vs-zero-distinction
type: concept
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.spec.ts
    hash: d174de1c248ee0ac50c3c194fb22c7ad809d695449006a10785ee397e2456f3a
  - path: libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts
    hash: 5899eda2f82abd0754284cbf8fa18b4e26c127910d1bf4acc688956306f226d6
sources_digest: 4db5c34d4dfc0d22af61c95d14aa7606075a1e953cb144d6ffe08671166032d3
links: []
generator:
  version: 1
covers:
  - symbol: cell
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.spec.ts:L247-L248
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
---

<!-- context:generated:start -->

## Summary

Critical invariant throughout aggregation and filtering: undefined/null/NaN represents missing data (should not render or contribute to aggregates), while numeric 0 is a measured value. Failure modes: division-by-zero in averaging, incorrect ramp extremes when missing data returns 0, and false zero visualization. Test coverage at line 168 fixes regression where missing data returned 0 instead of undefined.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
