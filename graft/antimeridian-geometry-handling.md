---
name: Antimeridian Geometry Handling
slug: antimeridian-geometry-handling
type: concept
sources:
  - path: libs/data-transforms/src/buffer/buffer.ts
    hash: 9e386866284f1a20844402bc2296f1681331d89ff65736af84fddb27be4dc41d
  - path: libs/data-transforms/src/dissolve/dissolve.ts
    hash: db5ae4d7b8c3fdbf4ce3b2af2250aeebd3d10574582cd3bccf2bef6ec3a9e29b
  - path: libs/data-transforms/src/features/filter-features-by-bounds.ts
    hash: db7dd24e19efd7ff9858a2d35f32544eedeae8f8939e9943da37a8f52d34e2fd
sources_digest: e8c0322b213114ed0ea75b7e7df036084822ab274c0fd07cb1e8bb0989f07b50
links:
  - to: geospatial-data-transformations
    relation: part_of
    description: >-
      Antimeridian handling is a core concern across multiple geospatial
      transformation modules
generator:
  version: 1
covers:
  - symbol: BufferedFeature
    kind: type
    at: 'libs/data-transforms/src/buffer/buffer.ts:L6-L6'
  - symbol: BufferUnit
    kind: type
    at: 'libs/data-transforms/src/buffer/buffer.ts:L8-L8'
  - symbol: BufferOperation
    kind: type
    at: 'libs/data-transforms/src/buffer/buffer.ts:L9-L9'
  - symbol: GetGeometryBufferParams
    kind: type
    at: 'libs/data-transforms/src/buffer/buffer.ts:L10-L13'
  - symbol: getFeatureBuffer
    kind: function
    at: 'libs/data-transforms/src/buffer/buffer.ts:L15-L45'
  - symbol: getGeometryDissolved
    kind: function
    at: 'libs/data-transforms/src/dissolve/dissolve.ts:L6-L41'
  - symbol: Bounds
    kind: interface
    at: 'libs/data-transforms/src/features/filter-features-by-bounds.ts:L10-L15'
  - symbol: GeoJSONFeature
    kind: class
    at: 'libs/data-transforms/src/features/filter-features-by-bounds.ts:L21-L37'
  - symbol: filterFeaturesByBounds
    kind: function
    at: 'libs/data-transforms/src/features/filter-features-by-bounds.ts:L39-L97'
---

<!-- context:generated:start -->

## Summary

Cross-cutting constraint where geometries that cross the antimeridian (±180° longitude) must be detected by checking if bounding box minX falls below or maxX rises above a buffered threshold (BUFFERED_ANTIMERIDIAN_LON), then conditionally wrapped via wrapFeatureLongitudes before buffering or dissolution to prevent invalid coordinate artifacts. This pattern appears in buffer.ts, dissolve.ts, and implicitly guides feature filtering logic.

## Related

- part of [[geospatial-data-transformations]] — Antimeridian handling is a core concern across multiple geospatial transformation modules

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
