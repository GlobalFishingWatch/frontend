---
name: vessel-tracks parsing pipeline
slug: vessel-tracks-parsing-pipeline
type: system
sources:
  - path: libs/deck-loaders/src/vessels/lib/parse-tracks.spec.ts
    hash: 9039b4be218997e632d72c69d0853b75e47e5e4ce21800f220ec5ae4720bf618
  - path: libs/deck-loaders/src/vessels/lib/parse-tracks.ts
    hash: 71e1614377ee1c41672932774587608f1ab7713ff87848859a2b75baa35cea4b
  - path: libs/deck-loaders/src/vessels/lib/vessel-track-proto.ts
    hash: 5e7c9b1332849d8c250440a51fbc81100168385af3f7ab3424f9d7095a405e88
  - path: libs/deck-loaders/src/vessels/lib/vessel-track.proto
    hash: 19a7669e4cbefa5dc4da5370264cdb1743ce189c4bc2e778f1b89821aa4670f8
sources_digest: cd07dfdc95f5e3c4fcc4e0ca860bc02b77e29e8fcf5005db33469ee050203531
links:
  - to: vessel-tracks-loaders-loaders-gl
    relation: produces
    description: >-
      parseTrack is the core parsing backend invoked by VesselTrackLoader and
      VesselTrackWorkerLoader
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

Decodes protobuf-serialized vessel tracking data into structured formats with normalized speed/elevation bounds and optional gap computation. Converts relative timestamps to absolute milliseconds via configurable timestampBase; clamps speed (0–25 knots) and elevation (0 to −6000m) to safe visualization ranges.

## Related

- produces [[vessel-tracks-loaders-loaders-gl]] — parseTrack is the core parsing backend invoked by VesselTrackLoader and VesselTrackWorkerLoader

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
