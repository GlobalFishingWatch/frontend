---
name: Temporal and Spatial Filtering for Segments
slug: temporal-and-spatial-filtering-for-segments
type: system
sources:
  - path: libs/data-transforms/src/segments/segments-timerange-filter.ts
    hash: cf8a8b7ca6cfe144a3774f86c50c42bdfffcc1c42d5b5a8cce124a601e8827a2
  - path: libs/data-transforms/src/segments/segments-to-bbox.ts
    hash: 73aaa91cd04224eaaf729a0700d38bb8078cc74ad9e8f239a9b88013a7a8b355
sources_digest: f25ea7ebefff0b3ca93220ba189725543c1885733711799185615dc9c0df4879
links:
  - to: antimeridian-handling
    relation: uses
    description: >-
      Bounding box computation uses wrapPointLongitudes to handle antimeridian
      crossing before Turf bbox calculation
generator:
  version: 1
covers:
  - symbol: TimeRange
    kind: type
    at: 'libs/data-transforms/src/segments/segments-timerange-filter.ts:L9-L9'
  - symbol: filterSegmentsByTimerange
    kind: function
    at: 'libs/data-transforms/src/segments/segments-timerange-filter.ts:L10-L31'
  - symbol: getBboxFromPoints
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-bbox.ts:L9-L12'
  - symbol: segmentsToBbox
    kind: function
    at: 'libs/data-transforms/src/segments/segments-to-bbox.ts:L14-L22'
---

<!-- context:generated:start -->

## Summary

Provides time-based and spatial filtering for track segments. filterSegmentsByTimerange accepts TimeRange specs (ISO strings or millisecond timestamps) and returns segments whose points fall within the window using strict inequality checks. Optional includeNonTemporalSegments flag handles edge cases where some track points lack timestamp data. Completely out-of-range segments are discarded; partial overlaps are preserved.

## Related

- uses [[antimeridian-handling]] — Bounding box computation uses wrapPointLongitudes to handle antimeridian crossing before Turf bbox calculation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
