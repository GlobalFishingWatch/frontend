---
name: GeoJSON Feature Generation
slug: geojson-feature-generation
type: concept
sources:
  - path: apps/port-labeler/src/features/map/map.selectors.ts
    hash: 7f69eaceff6bda219fc2e3cc751dd232820f73bcfe9db59cf4360723a3f62b06
sources_digest: 2e3c9826b2f76c734c02559751b7bbd9c93b0bdc476d4713d60eeff6b94e3206
links:
  - to: labeler-state-management
    relation: depends_on
    description: 'Reads port points, subareas, and metadata from labeler selectors'
  - to: port-labeler-map-system
    relation: part_of
    description: Selectors produce GeoJSON features consumed by MapLibre layers
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Redux selectors in map.selectors transform labeler state into GeoJSON features and Mapbox GL layer configurations using Turf.js geometric operations. Clusters points into hierarchical groups by port/subarea, generates concave hull polygons with buffers, and applies color/selection styling. Requires minimum 3-point density threshold for valid area generation.

## Related

- depends on [[labeler-state-management]] — Reads port points, subareas, and metadata from labeler selectors
- part of [[port-labeler-map-system]] — Selectors produce GeoJSON features consumed by MapLibre layers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
