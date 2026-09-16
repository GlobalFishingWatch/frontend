---
name: Segments to GeoJSON Conversion
slug: segments-to-geojson-conversion
type: system
sources:
  - path: libs/data-transforms/src/segments/index.ts
    hash: 54bfefa64fbff23c5ac0eb38c925666a931e4a2d10eaf762da02301cf5a2fe9a
  - path: libs/data-transforms/src/segments/segments-to-geojson.ts
    hash: 8c64b1f115b11d9f9b239db563132f087795876d05ba837b2ed6abb93fd9b1ee
sources_digest: ab874362a508afa2a71bf4582c09b35ec0944b97a9de5dc5d01d648a2a526171
links:
  - to: bounding-box-computation
    relation: uses
    description: >-
      getSegmentExtents delegates spatial boundary detection to coordinate
      validation
  - to: segments-configuration-constants
    relation: uses
    description: >-
      Uses COORDINATE_PROPERTY_TIMESTAMP and COORDINATES_PROPERTIES_ID constants
      for standardized metadata handling
generator:
  version: 1
covers:
  - symbol: segmentsToFeatures
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-geojson.ts:L10-L59'
  - symbol: segmentsToGeoJSON
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-geojson.ts:L61-L77'
  - symbol: geoJSONToSegments
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-geojson.ts:L81-L142'
  - symbol: getSegmentExtents
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-geojson.ts:L144-L146'
---

<!-- context:generated:start -->

## Summary

Converts between TrackSegment arrays and GeoJSON LineString FeatureCollections, preserving per-coordinate metadata (timestamps, speeds, elevations) as coordinate-indexed property arrays rather than embedding in coordinate objects. Inverse conversion with optional extent-only mode to extract start/end points. Handles both single and nested segment arrays through type coercion checks.

## Related

- uses [[bounding-box-computation]] — getSegmentExtents delegates spatial boundary detection to coordinate validation
- uses [[segments-configuration-constants]] — Uses COORDINATE_PROPERTY_TIMESTAMP and COORDINATES_PROPERTIES_ID constants for standardized metadata handling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
