---
name: timestamp alignment across simplification
slug: timestamp-alignment-across-simplification
type: concept
sources:
  - path: libs/deck-loaders/src/user/lib/parse-user-tracks.ts
    hash: 7e7f6d50ae2fe1b93ea1b926048bd6167fbef25255ccd05ead8b43971e58aa29
  - path: libs/deck-loaders/src/user/lib/simplify-user-tracks.spec.ts
    hash: e807400be1195db76b89d65812e8d990cf879f3fdf7699de1bfafe7ae3ba7742
  - path: libs/deck-loaders/src/user/lib/simplify-user-tracks.ts
    hash: 7676aa2c9d15a273ea6e7de12fe6b4b0acc6086b64076dd6944a953a1a59d3d2
sources_digest: 4850757c493c8b05d7c4a0c1342642e5276a859725b64f878da0837fdd4a9687
links:
  - to: user-tracks-simplification-and-lod-selection
    relation: part_of
    description: >-
      simplifyUserTrackBinary preserves timestamp-position alignment while
      reducing vertices
generator:
  version: 1
covers:
  - symbol: arrayBufferToJson
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.ts:L8-L17'
  - symbol: ParseUserTrackParams
    kind: type
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.ts:L19-L24'
  - symbol: parseUserTrack
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.ts:L28-L102'
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

When vertices are removed by Douglas-Peucker simplification, timestamps must stay synchronized by removing the corresponding timestamp entries, not just coordinates. Simplification maintains index-based alignment: position array and timestamp array must have identical length after filtering.

## Related

- part of [[user-tracks-simplification-and-lod-selection]] — simplifyUserTrackBinary preserves timestamp-position alignment while reducing vertices

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
