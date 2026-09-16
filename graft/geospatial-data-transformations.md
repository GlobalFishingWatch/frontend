---
name: Geospatial Data Transformations
slug: geospatial-data-transformations
type: system
sources:
  - path: libs/data-transforms/src/buffer/buffer.ts
    hash: 9e386866284f1a20844402bc2296f1681331d89ff65736af84fddb27be4dc41d
  - path: libs/data-transforms/src/buffer/index.ts
    hash: 18966f7835834ac80750257982e6c65da4ab12978ed570c9ef3816bd280e58b0
  - path: libs/data-transforms/src/coordinates/coordinates.ts
    hash: cecaec64992e381abddf4cc885583bd24ea73dcdb6c941d975c86cb9eaa9b923
  - path: libs/data-transforms/src/coordinates/index.ts
    hash: 94bb2bc293b9ad81f1e69fe4ac5dd59ebf6f749596362bd2615810d52e0f3373
  - path: libs/data-transforms/src/dissolve/dissolve.ts
    hash: db5ae4d7b8c3fdbf4ce3b2af2250aeebd3d10574582cd3bccf2bef6ec3a9e29b
  - path: libs/data-transforms/src/dissolve/index.ts
    hash: 8c877f42534a27e3b47352404c1c0e72796b5c0107228bdeba907edfedbb9cd6
  - path: libs/data-transforms/src/features/filter-features-by-bounds.ts
    hash: db7dd24e19efd7ff9858a2d35f32544eedeae8f8939e9943da37a8f52d34e2fd
  - path: libs/data-transforms/src/features/index.ts
    hash: 85e305ecba294e4a5b09f9a87d7b5b45d4291a9b93faf44e829a2832dd5d1ade
sources_digest: fe32009c82523ef562ede16083aad4f551d8aa004d9b22e98aa6b5fa35b26f0c
links:
  - to: antimeridian-geometry-handling
    relation: uses
    description: >-
      Buffer, dissolve, and feature filtering modules all depend on
      wrapFeatureLongitudes to prevent invalid coordinates when geometries
      approach ±180° boundaries
  - to: api-type-contracts
    relation: uses
    description: >-
      filterFeaturesByBounds processes GeoJSONFeature, FourwingsFeature, and
      FourwingsPointFeature types from api-types and deck-loaders
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
  - symbol: isValidCoordinate
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L9-L11'
  - symbol: isValidLngLat
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L13-L20'
  - symbol: toLngLatCoordinates
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L22-L27'
  - symbol: parseCoords
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L29-L45'
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

Collection of modules providing geospatial operations including buffering, coordinate normalization, bounding box calculations, feature filtering, and geometric dissolution with specialized handling for antimeridian-crossing geometries. The system uses Turf.js as the core geometric engine while adding custom wrapping and longitude normalization logic to handle world-wrapping coordinate systems common in maritime tracking.

## Related

- uses [[antimeridian-geometry-handling]] — Buffer, dissolve, and feature filtering modules all depend on wrapFeatureLongitudes to prevent invalid coordinates when geometries approach ±180° boundaries
- uses [[api-type-contracts]] — filterFeaturesByBounds processes GeoJSONFeature, FourwingsFeature, and FourwingsPointFeature types from api-types and deck-loaders

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
