---
name: simplify-js dependency
slug: simplify-js-dependency
type: file
sources:
  - path: libs/deck-loaders/src/user/lib/simplify-user-tracks.spec.ts
    hash: e807400be1195db76b89d65812e8d990cf879f3fdf7699de1bfafe7ae3ba7742
  - path: libs/deck-loaders/src/user/lib/simplify-user-tracks.ts
    hash: 7676aa2c9d15a273ea6e7de12fe6b4b0acc6086b64076dd6944a953a1a59d3d2
sources_digest: c7351f5fd81774e75376b3a84d089c052b3b406d02857eeea17f749857e80f4f
links:
  - to: user-tracks-simplification-and-lod-selection
    relation: uses
    description: simplifyUserTrackBinary calls simplify-js's point reduction algorithm
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

External Douglas-Peucker simplification library used by simplifyUserTrackBinary to reduce GPS track vertex count while maintaining path shape and spatial error bounds.

## Related

- uses [[user-tracks-simplification-and-lod-selection]] — simplifyUserTrackBinary calls simplify-js's point reduction algorithm

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
