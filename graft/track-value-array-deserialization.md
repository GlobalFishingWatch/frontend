---
name: Track Value Array Deserialization
slug: track-value-array-deserialization
type: system
sources:
  - path: libs/data-transforms/src/track-value-array-to-segments/index.ts
    hash: aed5d9962dc9bceb6c36a232305f757fb5cdfd7bea4cbafc83ce82c5793fdeaf
  - path: >-
      libs/data-transforms/src/track-value-array-to-segments/track-value-array-to-segments.ts
    hash: 565e1785527f0416a0875f9f8bc31473d83a3d476930f2f4cea977f9713c05ea
sources_digest: a4288a3395c3bf34a723fd8aad8c32553d8ea39150a00a699667d6b56e0ae13e
links:
  - to: segments-to-geojson-conversion
    relation: produces
    description: Produces TrackSegment arrays that feed into segment-to-GeoJSON conversion
generator:
  version: 1
covers:
  - symbol: trackValueArrayToSegments
    kind: function
    at: >-
      libs/data-transforms/src/track-value-array-to-segments/track-value-array-to-segments.ts:L31-L115
---

<!-- context:generated:start -->

## Summary

Deserializes compressed arrays of vessel tracking data (Int32 format) into structured TrackSegment objects with parsed geographic and temporal fields. Applies field-specific transformer functions to convert encoded values to floating-point representations (1e−6 precision for coordinates/speed, 1e3 scale for timestamps, 1e−2 for course). Handles the compound lonlat field expansion and null-value detection via sentinel marker in first array element.

## Related

- produces [[segments-to-geojson-conversion]] — Produces TrackSegment arrays that feed into segment-to-GeoJSON conversion

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
