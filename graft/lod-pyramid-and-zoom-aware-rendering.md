---
name: LOD pyramid and zoom-aware rendering
slug: lod-pyramid-and-zoom-aware-rendering
type: concept
sources:
  - path: libs/deck-loaders/src/user/lib/simplify-user-tracks.ts
    hash: 7676aa2c9d15a273ea6e7de12fe6b4b0acc6086b64076dd6944a953a1a59d3d2
  - path: libs/deck-loaders/src/user/lib/types.ts
    hash: d2d4b4bb7e49883f281ccb5387f6249adbd35c9aad3631f183551b7f8b9a4ee8
sources_digest: 03b649a07eb84556c0e7c6243ab53dcc8e36646a2f41b0090b470172dd26bbd6
links:
  - to: user-tracks-simplification-and-lod-selection
    relation: part_of
    description: >-
      buildUserTrackLods, getUserTrackLodIndex, and toleranceAtZoom implement
      the pre-computed pyramid pattern
generator:
  version: 1
covers:
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
  - symbol: UserTrackBinaryData
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L3-L15'
  - symbol: UserTrackFeatureProperties
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L17-L20'
  - symbol: UserTrackFeature
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L21-L21'
  - symbol: UserTrackRawData
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L22-L25'
  - symbol: UserTrackLod
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L27-L31'
  - symbol: UserTrackData
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L33-L38'
---

<!-- context:generated:start -->

## Summary

Trade storage for zero-cost panning/zooming by pre-computing simplified representations at multiple tolerance thresholds upfront. getUserTrackLodIndex maps zoom levels to LOD buckets; visual error is calibrated at 0.5 pixels per zoom level via mercatorY projection math. Finest LOD contains original unmodified data; coarser levels progressively reduce vertex count.

## Related

- part of [[user-tracks-simplification-and-lod-selection]] — buildUserTrackLods, getUserTrackLodIndex, and toleranceAtZoom implement the pre-computed pyramid pattern

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
