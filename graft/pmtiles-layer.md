---
name: PMTiles Layer
slug: pmtiles-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/pm-tiles/index.ts
    hash: dbd60f630bf676773ce2a051666c75299d1066d32c0febfd4cbba27ace856895
  - path: libs/deck-layers/src/layers/pm-tiles/pm-tiles.types.ts
    hash: 89a623ab01f33308e7f478889d9f85d5e92f857998bd8bb374b0805b123bec03
  - path: libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts
    hash: 7af92605e883c29ce756243a195effbb9e9e083a3c380239270a13f80d675d6f
sources_digest: fa47fd5ad377354fe4917c562f86b87ae43fb837d573c2d9f083a6c439cf433a
links:
  - to: deck-gl-composite-layer-pattern
    relation: uses
    description: >-
      Extends TileLayer, uses deck.gl state management (updateState) to track
      dataChanged and reinitialize tileSource on URL changes
generator:
  version: 1
covers:
  - symbol: PMTilesLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts:L9-L11'
  - symbol: PMTilesLayer
    kind: class
    at: 'libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts:L13-L51'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts:L17-L22'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts:L24-L35'
  - symbol: createTileSource
    kind: method
    at: 'libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts:L37-L42'
  - symbol: getTileData
    kind: method
    at: 'libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts:L44-L50'
  - symbol: PMTilesFeatureProperties
    kind: type
    at: 'libs/deck-layers/src/layers/pm-tiles/pm-tiles.types.ts:L7-L14'
  - symbol: PMTilePickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/pm-tiles/pm-tiles.types.ts:L16-L16'
  - symbol: PMTilePickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/pm-tiles/pm-tiles.types.ts:L18-L18'
  - symbol: PMTileLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/pm-tiles/pm-tiles.types.ts:L20-L31'
---

<!-- context:generated:start -->

## Summary

Deck.gl custom layer extending TileLayer to render tiled geospatial data from PMTiles archives (single-file tile format). Manages loaders.gl TileSource lifecycle, creates new sources on data URL changes, and delegates tile fetching to underlying tileSource.

## Related

- uses [[deck-gl-composite-layer-pattern]] — Extends TileLayer, uses deck.gl state management (updateState) to track dataChanged and reinitialize tileSource on URL changes

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
