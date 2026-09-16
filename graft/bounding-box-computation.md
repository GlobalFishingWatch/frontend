---
name: Bounding Box Computation
slug: bounding-box-computation
type: file
sources:
  - path: libs/data-transforms/src/segments/segments-to-bbox.ts
    hash: 73aaa91cd04224eaaf729a0700d38bb8078cc74ad9e8f239a9b88013a7a8b355
sources_digest: 5bd374aa310b014e253b2ef7c6183817028fa2d865195b42ad2a8368c75dbd3d
links:
  - to: antimeridian-handling
    relation: uses
    description: >-
      Uses wrapPointLongitudes to handle antimeridian crossing before Turf bbox
      calculation
  - to: temporal-and-spatial-filtering-for-segments
    relation: part_of
    description: Provides spatial extent computation for segment filtering and analysis
generator:
  version: 1
covers:
  - symbol: getBboxFromPoints
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-bbox.ts:L9-L12'
  - symbol: segmentsToBbox
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-bbox.ts:L14-L22'
---

<!-- context:generated:start -->

## Summary

Computes bounding boxes from GeoJSON points and TrackSegment arrays by extracting valid coordinate pairs and explicitly wrapping longitudes using wrapPointLongitudes helper to prevent bounding boxes from spanning the entire globe when features cross the international date line. Filters out points with missing coordinates to ensure valid geometry.

## Related

- uses [[antimeridian-handling]] — Uses wrapPointLongitudes to handle antimeridian crossing before Turf bbox calculation
- part of [[temporal-and-spatial-filtering-for-segments]] — Provides spatial extent computation for segment filtering and analysis

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
