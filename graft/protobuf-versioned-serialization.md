---
name: protobuf-versioned serialization
slug: protobuf-versioned-serialization
type: concept
sources:
  - path: libs/deck-loaders/src/vessels/lib/parse-tracks.spec.ts
    hash: 9039b4be218997e632d72c69d0853b75e47e5e4ce21800f220ec5ae4720bf618
  - path: libs/deck-loaders/src/vessels/lib/vessel-track-proto.ts
    hash: 5e7c9b1332849d8c250440a51fbc81100168385af3f7ab3424f9d7095a405e88
  - path: libs/deck-loaders/src/vessels/lib/vessel-track.proto
    hash: 19a7669e4cbefa5dc4da5370264cdb1743ce189c4bc2e778f1b89821aa4670f8
sources_digest: ffc414795efe5b5f49dee4c62bc566be9e4e1ad7243a245aa15619a44584c451
links:
  - to: vessel-tracks-parsing-pipeline
    relation: part_of
    description: >-
      DeckTrack protobuf structure defines the schema that parseTrack must
      deserialize
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Vessel track protobuf schemas (vessel-track.proto) must be regenerated after changes via pnpm nx run deck-loaders:proto:generate. The generated code is isolated in vessel-track-proto.gen.js, with hand-maintained interface vessel-track-proto.ts re-exporting DeckTrack. Tests guard against protobufjs version regressions (specifically 8.8.0's stricter length-delimited field handling) by round-tripping encoded tracks through full decode pipelines.

## Related

- part of [[vessel-tracks-parsing-pipeline]] — DeckTrack protobuf structure defines the schema that parseTrack must deserialize

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
