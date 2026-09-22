---
name: Tile Coordinate System
slug: tile-coordinate-system
type: system
sources:
  - path: libs/deck-layers/src/layers/_shared/tiles.utils.ts
    hash: 9fb13ab1ef3c39a1ab8a29fdcdafb5e2eb26f63dfcc7b0f712eb1d97271a616c
sources_digest: a9d010c344afa9f32edafdef82084dcd52521fa1399fbc139d1d4b40d5fd8a3d
links:
  - to: api-integration-and-data-loading
    relation: depends_on
    description: >-
      Transforms tile data loaded via API utilities into proper geographic
      coordinates
generator:
  version: 1
covers:
  - symbol: Point
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L13-L18'
  - symbol: getPoints
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L20-L22'
  - symbol: MultiPoint
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L24-L26'
  - symbol: LineString
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L28-L30'
  - symbol: MultiLineString
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L32-L34'
  - symbol: Polygon
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L36-L38'
  - symbol: MultiPolygon
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L40-L42'
  - symbol: getMVTSublayerProps
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L53-L78'
  - symbol: isPMTilesUrl
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L80-L82'
  - symbol: getPMTilesSublayerProps
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L84-L99'
  - symbol: transformCoordinates
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L102-L115'
  - symbol: transformTileCoordsToWGS84
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/tiles.utils.ts:L117-L131'
---

<!-- context:generated:start -->

## Summary

Manages coordinate transformations between tile-local, world, and WGS84 coordinate systems for MVT and PMTiles rendering, handling geometry type dispatch and viewport projection.

## Related

- depends on [[api-integration-and-data-loading]] — Transforms tile data loaded via API utilities into proper geographic coordinates

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
