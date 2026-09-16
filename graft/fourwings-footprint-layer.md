---
name: Fourwings Footprint Layer
slug: fourwings-footprint-layer
type: system
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/footprint/fourwings-footprint.types.ts
    hash: 0b3cefd54f8d0fab7a985235f51059cda62166f7546afa3fe85ce189e57a2609
  - path: libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintLayer.ts
    hash: dd7365e4299160eeabfb5433e455a27778f666c41935c76cb28994cf114f4697
  - path: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts
    hash: 5dffa1f1da704b6bcf79c4b17817cb92c55ea5af306a48d8c25e6217117c23bc
sources_digest: bd9100ab1f2de9db5145abdc6ac8a456f8f70d83e91edf6cbc716182e0148a2e
links:
  - to: deck-gl-core-integration
    relation: uses
    description: >-
      Uses Deck.gl layer context and configuration utilities
      (getLayerGroupOffset, hexToDeckColor)
  - to: fourwings-data-infrastructure
    relation: depends_on
    description: >-
      Depends on fourwings-heatmap.utils for time-range-based cell value
      aggregation; uses FourwingsFeature objects and temporal interval parsing
  - to: vector-tile-layer-infrastructure
    relation: uses
    description: >-
      Extends TileLayer; FourwingsFootprintLayer composes SolidPolygonLayer and
      PathLayer for cell visualization and feature highlights
generator:
  version: 1
covers:
  - symbol: FourwingsFootprintLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintLayer.ts:L26-L173
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintLayer.ts:L103-L168
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintLayer.ts:L170-L172
  - symbol: FourwingsFootprintTileLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L54-L307
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L60-L71
  - symbol: cacheHash
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L73-L75
  - symbol: debounceTime
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L77-L79
  - symbol: viewportLoaded
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L81-L83
  - symbol: getError
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L85-L87
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L171-L189
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L191-L220
  - symbol: getLayerInstance
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L222-L225
  - symbol: getTilesData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L227-L243
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L245-L247
  - symbol: getIsPositionsAvailable
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L249-L264
  - symbol: getViewportData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L266-L280
  - symbol: getFourwingsLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts:L282-L284
  - symbol: _FourwingsFootprintTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/fourwings-footprint.types.ts:L12-L19
  - symbol: FourwingsFootprintTileLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/fourwings-footprint.types.ts:L21-L22
  - symbol: FourwingsFootprintTileLayerState
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/fourwings-footprint.types.ts:L24-L28
  - symbol: FourwingsFootprintLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/footprint/fourwings-footprint.types.ts:L30-L36
---

<!-- context:generated:start -->

## Summary

Renders geospatial fishing activity footprints as colored polygons with dynamic shading based on aggregated temporal data. Computes fill colors on-the-fly via hex-to-deck color conversion; uses timeRangeKey as cache key for aggregated values. Integrates with tile-layer infrastructure for viewport-synchronized data fetching and manages rendering state including error handling and tile caching.

## Related

- uses [[deck-gl-core-integration]] — Uses Deck.gl layer context and configuration utilities (getLayerGroupOffset, hexToDeckColor)
- depends on [[fourwings-data-infrastructure]] — Depends on fourwings-heatmap.utils for time-range-based cell value aggregation; uses FourwingsFeature objects and temporal interval parsing
- uses [[vector-tile-layer-infrastructure]] — Extends TileLayer; FourwingsFootprintLayer composes SolidPolygonLayer and PathLayer for cell visualization and feature highlights

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
