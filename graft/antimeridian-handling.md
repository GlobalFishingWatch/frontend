---
name: Antimeridian Handling
slug: antimeridian-handling
type: system
sources:
  - path: libs/data-transforms/src/wrap-longitudes/get-turf-bbox.test.ts
    hash: 53605e9594dfbcd29af34cc38ef19d557e48275eb29df9d25d2af3399a45d865
  - path: libs/data-transforms/src/wrap-longitudes/index.ts
    hash: 939b8d452703c395417a5153a4bfa202017b189a5c9bbb8efca4cd71c27018d6
  - path: >-
      libs/data-transforms/src/wrap-longitudes/split-geometry-at-antimeridian.test.ts
    hash: b43c08e59b10918634e2896549f97352c712afed477a38bc277ca4a1f5c1a178
  - path: libs/data-transforms/src/wrap-longitudes/unwrap-feature-longitudes.test.ts
    hash: 6ecbf01e8f8f6bb084dff13df47e019fdafaa59325efe94865deaec70e151376
  - path: libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts
    hash: 2c01f5ced39b3b046e7240c96350e5b00d9883f847de9757dca2210cd56198e6
sources_digest: 726a22c0cdfc1ad76fd88ce8d1e15d7969db24f3e91221895b2da3c683c76258
links:
  - to: bounding-box-computation
    relation: produces
    description: >-
      Produces wrapped coordinate sequences that feed into bounding box
      calculations
  - to: polygon-boolean-operations
    relation: uses
    description: >-
      splitGeometryAtAntimeridian uses getPolygonsIntersection to clip wrapped
      geometries back into valid ranges
generator:
  version: 1
covers:
  - symbol: antimeridianArea
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/get-turf-bbox.test.ts:L7-L29'
  - symbol: lons
    kind: function
    at: >-
      libs/data-transforms/src/wrap-longitudes/split-geometry-at-antimeridian.test.ts:L9-L10
  - symbol: antimeridianArea
    kind: function
    at: >-
      libs/data-transforms/src/wrap-longitudes/split-geometry-at-antimeridian.test.ts:L13-L35
  - symbol: feature
    kind: function
    at: >-
      libs/data-transforms/src/wrap-longitudes/unwrap-feature-longitudes.test.ts:L6-L10
  - symbol: wrapLongitudes
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L12-L28'
  - symbol: wrapBBoxLongitudes
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L30-L34'
  - symbol: wrapPointLongitudes
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L36-L59'
  - symbol: wrapLineStringLongitudes
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L61-L87'
  - symbol: WrapLongitudesParams
    kind: type
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L89-L91'
  - symbol: wrapLineStringFeatureCoordinates
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L93-L108'
  - symbol: normalizeLongitude
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L110-L114'
  - symbol: wrapPolygonFeatureCoordinates
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L116-L127'
  - symbol: wrapMultipolygonFeatureCoordinates
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L129-L136'
  - symbol: wrapFeatureLongitudes
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L138-L160'
  - symbol: getTurfBbox
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L168-L170'
  - symbol: wrapGeometryBbox
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L172-L189'
  - symbol: wrapFeaturesLongitudes
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L191-L193'
  - symbol: unwrapPositions
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L198-L202'
  - symbol: unwrapCoordinates
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L204-L219'
  - symbol: unwrapFeatureLongitudes
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L229-L240'
  - symbol: worldClipRing
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L243-L251'
  - symbol: clipWorldCopy
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L257-L265'
  - symbol: splitGeometryAtAntimeridian
    kind: function
    at: 'libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts:L271-L292'
---

<!-- context:generated:start -->

## Summary

Solves critical geospatial bugs arising from ±180° longitude line crossing in web map renderers. Wraps coordinates incrementally to keep sequences continuous when consecutive jumps exceed ±180°. Normalizes extreme values to buffered thresholds (179.5 and 180.1) to prevent false antimeridian detection. Unwraps feature coordinates back to [-180, 180] range. Splits geometries that span multiple world copies back into valid GeoJSON using polygon intersection. Handles all GeoJSON geometry types (Point, LineString, Polygon, MultiPolygon) recursively.

## Related

- produces [[bounding-box-computation]] — Produces wrapped coordinate sequences that feed into bounding box calculations
- uses [[polygon-boolean-operations]] — splitGeometryAtAntimeridian uses getPolygonsIntersection to clip wrapped geometries back into valid ranges

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
