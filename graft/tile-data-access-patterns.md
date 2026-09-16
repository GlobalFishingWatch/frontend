---
name: Tile Data Access Patterns
slug: tile-data-access-patterns
type: concept
sources:
  - path: libs/deck-layers/src/layers/context/context.utils.ts
    hash: 1fb085368f2c513be2411ff98c59eed542893fa75beba1aaada83d3d7a9f2699
  - path: libs/deck-layers/src/layers/fourwings/fourwings-tile.utils.ts
    hash: 241b421e9e01299c2addafb2a399e500865eebff23648641d99cad13e53034cf
sources_digest: 710b67d9d4aab3c01b561cb2965ff57a7e9c4419d241af2ee739dd92b519eedd
links:
  - to: deck-gl-core-integration
    relation: depends_on
    description: >-
      Depends on @deck.gl/core Viewport type for coordinate unprojection and
      geo-layers Tile2DHeader
  - to: vector-tile-layer-infrastructure
    relation: implements
    description: >-
      Operates on tiles loaded by TileLayer instances; uses Tile2DHeader
      metadata for coordinate transformation
generator:
  version: 1
covers:
  - symbol: getContextId
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L21-L32'
  - symbol: getContextFiltersHash
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L34-L38'
  - symbol: getContextFilterOperatorsHash
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L40-L46'
  - symbol: getValidSublayerFilters
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L48-L56'
  - symbol: hasSublayerFilters
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L58-L60'
  - symbol: supportDataFilterExtension
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L67-L76'
  - symbol: getContextLink
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L106-L140'
  - symbol: getSelectedTilesFeatures
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L149-L176'
  - symbol: mergePickedFeatures
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L178-L228'
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

Cross-cutting pattern for extracting and filtering features from loaded tiles without GPU-based picking. Tile-level access retrieves all features within viewport bounds using transformTileCoordsToWGS84 for coordinate conversion; avoids GPU picking limitations (misses small polygons <1 screen pixel). Used by ContextLayer.getSelectedTilesFeatures and Fourwings layers for feature visibility analysis.

## Related

- depends on [[deck-gl-core-integration]] — Depends on @deck.gl/core Viewport type for coordinate unprojection and geo-layers Tile2DHeader
- implements [[vector-tile-layer-infrastructure]] — Operates on tiles loaded by TileLayer instances; uses Tile2DHeader metadata for coordinate transformation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
