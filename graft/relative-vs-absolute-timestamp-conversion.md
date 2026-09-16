---
name: relative vs. absolute timestamp conversion
slug: relative-vs-absolute-timestamp-conversion
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
      toAbsoluteTimestamp and toRelativeTimestamp are core utilities in
      parseTrack's timestamp normalization
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

Vessel tracking data uses relative timestamps (Float32Array) stored as offsets from a configurable timestampBase epoch to avoid precision loss in 32-bit floats. Conversion functions toRelativeTimestamp and toAbsoluteTimestamp bridge between API-relative and millisecond-precision timestamps; this is essential for correct timeline alignment when multiple data sources use different base epochs.

## Related

- part of [[vessel-tracks-parsing-pipeline]] — toAbsoluteTimestamp and toRelativeTimestamp are core utilities in parseTrack's timestamp normalization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
