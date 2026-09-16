---
name: Polygon Boolean Operations
slug: polygon-boolean-operations
type: system
sources:
  - path: libs/data-transforms/src/union/index.ts
    hash: f4bcd22bd0f37b2b4a8883e6f3014e4d49489fec9a198ef28a2880d608f79868
  - path: libs/data-transforms/src/union/union.ts
    hash: 388739599e8a87325d1a41f636a065f658c5f77d49852c1c969bce85820c6eb1
sources_digest: beb2d4b7ba0fd4d1fd2e7fad7e0636919369d4724e2d795c38e05170ec7fb0cc
links:
  - to: antimeridian-handling
    relation: uses
    description: >-
      getPolygonsIntersection is used by splitGeometryAtAntimeridian to clip
      geometries that span the antimeridian
generator:
  version: 1
covers:
  - symbol: PolygonCoords
    kind: type
    at: 'libs/data-transforms/src/union/union.ts:L4-L4'
  - symbol: MultiPolygonCoords
    kind: type
    at: 'libs/data-transforms/src/union/union.ts:L5-L5'
  - symbol: PolygonGeomCoords
    kind: type
    at: 'libs/data-transforms/src/union/union.ts:L6-L6'
  - symbol: toPolygonFeature
    kind: function
    at: 'libs/data-transforms/src/union/union.ts:L9-L12'
  - symbol: toMultiPolygonCoords
    kind: function
    at: 'libs/data-transforms/src/union/union.ts:L14-L19'
  - symbol: getPolygonsUnion
    kind: function
    at: 'libs/data-transforms/src/union/union.ts:L21-L27'
  - symbol: getPolygonsIntersection
    kind: function
    at: 'libs/data-transforms/src/union/union.ts:L29-L35'
---

<!-- context:generated:start -->

## Summary

Computes geometric set operations on polygon coordinates by wrapping Turf.js. getPolygonsUnion merges overlapping polygons into single rings while preserving disjoint geometries as separate members. getPolygonsIntersection computes overlapping regions. Both normalize all results to MultiPolygonCoords format. Handles single-polygon inputs by bypassing Turf's two-geometry requirement. Ensures all output rings are properly closed (first coordinate equals last) to satisfy downstream Turf consumers like booleanPointInPolygon.

## Related

- uses [[antimeridian-handling]] — getPolygonsIntersection is used by splitGeometryAtAntimeridian to clip geometries that span the antimeridian

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
