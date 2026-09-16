---
name: Dataset Client
slug: dataset-client
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/dataviews.ts
    hash: 0d42273406e9a91e1e3b1dcfe757667707437757a57be3d15649496ba0e59c73
  - path: libs/deck-layer-composer/src/resolvers/fourwings.ts
    hash: b951f7b683df8a07f4ac314ab028ab68e0bdb56003a861924155d47ba3aa275b
  - path: libs/deck-layer-composer/src/resolvers/polygons.ts
    hash: 90175fcf5ffc48509ed3d49f51d9b02ee72f2c5def1a526a2892c843e3e23855
  - path: libs/deck-layer-composer/src/resolvers/user.ts
    hash: 28250fb08d0ab593f34d5b72fd1fbb1dd6a569efba3b7cb169cf672271d7250f
  - path: libs/deck-layer-composer/src/resolvers/vectors.ts
    hash: 95d2380d06bf8cb614d482a89f87d6b75c8e3930b50db81c714b1042c4687382
  - path: libs/deck-layer-composer/src/resolvers/vessels.ts
    hash: ec5ac48a92ff51388ce4aaa9c8380d939f917c4e735eb7676b7782c5f81b32ed
sources_digest: bfa5ad5e78bcf9f16595f7cd9f07f55c1ef169a01846c954c012645f62f1dab2
links: []
generator:
  version: 1
covers:
  - symbol: getDatasetsAvailableIntervals
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L54-L55'
  - symbol: getDataviewAvailableIntervals
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L57-L86'
  - symbol: getAvailableIntervalsInDataviews
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L88-L90'
  - symbol: GetMergedHeatmapAnimatedDataviewParams
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L92-L99'
  - symbol: getFourwingsDataviewSublayers
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L101-L151'
  - symbol: getFourwingsDataviewsResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L153-L251'
  - symbol: getFourwingsDataviewsMerged
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L170-L193'
  - symbol: groupContextDataviews
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L253-L263'
  - symbol: getContextDataviewsResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L265-L329'
  - symbol: ResolverGlobalConfig
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L342-L363'
  - symbol: getDataviewsSorted
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L393-L417'
  - symbol: getComparisonMode
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L419-L430'
  - symbol: DataviewGroupKey
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L447-L447'
  - symbol: DataviewsGrouped
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L448-L448'
  - symbol: getDataviewsGrouped
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L450-L462'
  - symbol: getDataviewsResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L464-L579'
  - symbol: resolveDeckFourwingsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/fourwings.ts:L36-L208'
  - symbol: resolvePolygonsDataUrl
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/polygons.ts:L12-L28'
  - symbol: resolveDeckPolygonsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/polygons.ts:L30-L49'
  - symbol: getUserContextTimeFilterProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L24-L59'
  - symbol: getUserPolygonColorProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L61-L82'
  - symbol: getUserCircleProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L84-L130'
  - symbol: resolveDeckUserLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L132-L226'
  - symbol: resolveDeckUserContextLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L228-L238'
  - symbol: resolveDeckUserPointsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L240-L251'
  - symbol: resolveDeckUserTracksLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L253-L264'
  - symbol: resolveDeckVectorsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vectors.ts:L14-L84'
  - symbol: resolveDeckVesselLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vessels.ts:L14-L98'
---

<!-- context:generated:start -->

## Summary

External dependency from @globalfishingwatch/datasets-client that provides dataset metadata lookup, endpoint resolution, and configuration property extraction used throughout the resolver system.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
