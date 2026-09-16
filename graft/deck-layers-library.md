---
name: Deck Layers Library
slug: deck-layers-library
type: system
sources:
  - path: libs/deck-layers/src/config/index.ts
    hash: fa8db9c58be105586d119f54acc134ab47081ea727b5b770a9f699c6fb33402c
  - path: libs/deck-layers/src/index.ts
    hash: d2b921b2d82155829be0e84db9b09c6350b202f20438539abcf1cdf8c0d17aac
  - path: libs/deck-layers/src/layers/basemap/index.ts
    hash: c5ddecbfda11b770752a547a5e9a1b02440c363c3979eb283adb99df3ab95e64
sources_digest: f90b4f7c3cbf6b9d05d4e76359e1c73945e6736f271e8c9ff0594c6739d9e298
links:
  - to: api-integration-and-data-loading
    relation: part_of
    description: 'Handles authenticated API requests, sprite loading, and tile parsing'
  - to: basemap-layer-suite
    relation: part_of
    description: 'Provides basemap imagery, labels, and tile boundary visualization'
  - to: bathymetry-and-contour-layers
    relation: part_of
    description: Renders depth contours and underwater topography
  - to: fourwings-heatmap-and-vector-layers
    relation: part_of
    description: Renders activity and detection heatmaps via tile-based aggregation
  - to: layer-type-and-configuration-system
    relation: part_of
    description: >-
      Core types and configuration constants that drive all layer
      implementations
  - to: picking-and-interaction-utilities
    relation: part_of
    description: Provides feature identification and highlighting across layer types
  - to: tile-coordinate-system
    relation: part_of
    description: >-
      Manages MVT and PMTiles coordinate transformations for proper tile
      rendering
  - to: user-data-and-polygon-layers
    relation: part_of
    description: Renders user-drawn geometries and context polygon overlays
  - to: vessel-and-track-layers
    relation: part_of
    description: 'Visualizes vessel positions, movement tracks, and events'
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

A comprehensive deck.gl-based visualization layer library providing specialized layer implementations for geospatial rendering (basemap, bathymetry, heatmaps, tracks, vessels, polygons, context overlays) with integrated picking, tile management, and styling.

## Related

- part of [[api-integration-and-data-loading]] — Handles authenticated API requests, sprite loading, and tile parsing
- part of [[basemap-layer-suite]] — Provides basemap imagery, labels, and tile boundary visualization
- part of [[bathymetry-and-contour-layers]] — Renders depth contours and underwater topography
- part of [[fourwings-heatmap-and-vector-layers]] — Renders activity and detection heatmaps via tile-based aggregation
- part of [[layer-type-and-configuration-system]] — Core types and configuration constants that drive all layer implementations
- part of [[picking-and-interaction-utilities]] — Provides feature identification and highlighting across layer types
- part of [[tile-coordinate-system]] — Manages MVT and PMTiles coordinate transformations for proper tile rendering
- part of [[user-data-and-polygon-layers]] — Renders user-drawn geometries and context polygon overlays
- part of [[vessel-and-track-layers]] — Visualizes vessel positions, movement tracks, and events

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
