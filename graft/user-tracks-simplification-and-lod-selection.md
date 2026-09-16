---
name: user-tracks simplification and LOD selection
slug: user-tracks-simplification-and-lod-selection
type: system
sources:
  - path: libs/deck-loaders/src/user/lib/simplify-user-tracks.spec.ts
    hash: e807400be1195db76b89d65812e8d990cf879f3fdf7699de1bfafe7ae3ba7742
  - path: libs/deck-loaders/src/user/lib/simplify-user-tracks.ts
    hash: 7676aa2c9d15a273ea6e7de12fe6b4b0acc6086b64076dd6944a953a1a59d3d2
sources_digest: c7351f5fd81774e75376b3a84d089c052b3b406d02857eeea17f749857e80f4f
links:
  - to: simplify-js-dependency
    relation: uses
    description: >-
      simplifyUserTrackBinary delegates Douglas-Peucker point-reduction to the
      external simplify-js library
  - to: user-tracks-parsing-pipeline
    relation: part_of
    description: >-
      simplifyUserTrackBinary and buildUserTrackLods are composed within
      parseUserTrack workflow
generator:
  version: 1
covers:
  - symbol: makeBinary
    kind: function
    at: 'libs/deck-loaders/src/user/lib/simplify-user-tracks.spec.ts:L16-L37'
  - symbol: mercatorY
    kind: function
    at: 'libs/deck-loaders/src/user/lib/simplify-user-tracks.ts:L5-L7'
  - symbol: toleranceAtZoom
    kind: function
    at: 'libs/deck-loaders/src/user/lib/simplify-user-tracks.ts:L10-L10'
  - symbol: IndexedPoint
    kind: type
    at: 'libs/deck-loaders/src/user/lib/simplify-user-tracks.ts:L20-L20'
  - symbol: simplifyUserTrackBinary
    kind: function
    at: 'libs/deck-loaders/src/user/lib/simplify-user-tracks.ts:L25-L73'
  - symbol: buildUserTrackLods
    kind: function
    at: 'libs/deck-loaders/src/user/lib/simplify-user-tracks.ts:L75-L81'
  - symbol: getUserTrackLodIndex
    kind: function
    at: 'libs/deck-loaders/src/user/lib/simplify-user-tracks.ts:L83-L89'
---

<!-- context:generated:start -->

## Summary

Simplifies GPS track geometry using Douglas-Peucker algorithm to create level-of-detail (LOD) pyramids for efficient zoom-dependent rendering. Tolerances scale with zoom level (0.0439px error at zoom 3, zero at finest), with pre-computed LOD tiers stored upfront to trade storage for zero runtime cost during panning.

## Related

- uses [[simplify-js-dependency]] — simplifyUserTrackBinary delegates Douglas-Peucker point-reduction to the external simplify-js library
- part of [[user-tracks-parsing-pipeline]] — simplifyUserTrackBinary and buildUserTrackLods are composed within parseUserTrack workflow

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
