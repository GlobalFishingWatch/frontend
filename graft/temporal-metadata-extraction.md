---
name: Temporal Metadata Extraction
slug: temporal-metadata-extraction
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/dataviews.ts
    hash: 0d42273406e9a91e1e3b1dcfe757667707437757a57be3d15649496ba0e59c73
  - path: libs/deck-layer-composer/src/resolvers/fourwings.ts
    hash: b951f7b683df8a07f4ac314ab028ab68e0bdb56003a861924155d47ba3aa275b
  - path: libs/deck-layer-composer/src/resolvers/vectors.ts
    hash: 95d2380d06bf8cb614d482a89f87d6b75c8e3930b50db81c714b1042c4687382
sources_digest: 0d561eb36002ddccb7b9348ab0cb181301a26cfb243584e1fe3c647db77a6f50
links:
  - to: fourwings-sublayer-extraction
    relation: produces
    description: >-
      getDataviewAvailableIntervals provides temporal metadata used by sublayer
      configuration
  - to: type-specific-layer-resolvers
    relation: produces
    description: >-
      Multiple resolvers call getDataviewAvailableIntervals to constrain layer
      rendering windows
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
  - symbol: resolveDeckVectorsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vectors.ts:L14-L84'
---

<!-- context:generated:start -->

## Summary

Extracts available time intervals and temporal bounds from datasets, enabling resolvers to determine supported time ranges and apply temporal filtering to layers.

## Related

- produces [[fourwings-sublayer-extraction]] — getDataviewAvailableIntervals provides temporal metadata used by sublayer configuration
- produces [[type-specific-layer-resolvers]] — Multiple resolvers call getDataviewAvailableIntervals to constrain layer rendering windows

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
