---
name: Tile Constraint Validation
slug: tile-constraint-validation
type: concept
sources:
  - path: libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.spec.ts
    hash: 1dae557419e4c4cb5d9844adb395cf88735e095d5a650e8cb8ebdfadd64dfc83
  - path: libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.ts
    hash: 241b421e9e01299c2addafb2a399e500865eebff23648641d99cad13e53034cf
sources_digest: 8586d4a1f557bbd8d4189a53951d37c650d5a17d4772f4f64474da8efbadedf8
links:
  - to: fourwings-data-infrastructure
    relation: implements
    description: >-
      Uses getCellValuesFrameRange from fourwings-heatmap utilities to map frame
      indices into sublayer arrays
generator:
  version: 1
covers:
  - symbol: cell
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.spec.ts:L18-L23'
  - symbol: FourwingsTileFrames
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.ts:L14-L17'
  - symbol: isTilePositionsOverLimit
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.ts:L19-L56'
  - symbol: getAreTilePositionsAvailable
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.ts:L58-L81'
---

<!-- context:generated:start -->

## Summary

Pattern for validating whether tile data fits within rendering constraints before visualization. Checks position counts within frame windows (considering per-sublayer start offsets) against MAX_POSITIONS_PER_TILE_SUPPORTED and MAX_POSITIONS_PER_TILE_VISUALIZED thresholds. Uses early-exit optimization to avoid iterating entire dataset once limit exceeded. Critical for Fourwings layers to prevent browser crashes from data overload.

## Related

- implements [[fourwings-data-infrastructure]] — Uses getCellValuesFrameRange from fourwings-heatmap utilities to map frame indices into sublayer arrays

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
