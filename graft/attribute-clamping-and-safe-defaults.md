---
name: attribute clamping and safe defaults
slug: attribute-clamping-and-safe-defaults
type: concept
sources:
  - path: libs/deck-loaders/src/vessels/lib/parse-tracks.spec.ts
    hash: 9039b4be218997e632d72c69d0853b75e47e5e4ce21800f220ec5ae4720bf618
  - path: libs/deck-loaders/src/vessels/lib/parse-tracks.ts
    hash: 71e1614377ee1c41672932774587608f1ab7713ff87848859a2b75baa35cea4b
sources_digest: b62a3283d3dec3640c17295182e792a40cbe2b31866d7de0cf9a49ebec662bfd
links:
  - to: vessel-tracks-parsing-pipeline
    relation: part_of
    description: >-
      getVesselGraphExtentClamped and getExtent enforce attribute bounds in
      parseTrack
generator:
  version: 1
covers:
  - symbol: getExtent
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-tracks.ts:L11-L45'
  - symbol: getVesselGraphExtentClamped
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-tracks.ts:L47-L61'
  - symbol: VesselTrackLoaderParams
    kind: type
    at: 'libs/deck-loaders/src/vessels/lib/parse-tracks.ts:L63-L70'
  - symbol: toAbsoluteTimestamp
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-tracks.ts:L72-L74'
  - symbol: toRelativeTimestamp
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-tracks.ts:L76-L78'
  - symbol: parseTrack
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-tracks.ts:L80-L162'
---

<!-- context:generated:start -->

## Summary

Vessel track attributes (speed, elevation) are clamped to predefined ranges (speed 0–25 knots, depth 0 to −6000m) to prevent shader artifacts from extreme or malformed values. NaN handling defaults to safe midpoint ranges rather than propagating invalid data. Elevation values are stored inverted (negative for depth) and must be reordered so shallower bounds appear first.

## Related

- part of [[vessel-tracks-parsing-pipeline]] — getVesselGraphExtentClamped and getExtent enforce attribute bounds in parseTrack

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
