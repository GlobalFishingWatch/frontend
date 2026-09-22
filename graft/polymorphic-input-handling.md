---
name: Polymorphic Input Handling
slug: polymorphic-input-handling
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/dataviews.ts
    hash: 0d42273406e9a91e1e3b1dcfe757667707437757a57be3d15649496ba0e59c73
  - path: libs/deck-layer-composer/src/resolvers/resolvers.ts
    hash: 9c70c44402782024823cd5a8f3bd91dbc78d6b2e6011ddc0d46ae032a6e7c14e
sources_digest: d25938ccbdcb1f630468ffff2171da31ee382ccb1c91c6c018d2912b0152cc3e
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
  - symbol: DeckLayerClass
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L48-L48'
  - symbol: DeckLayerResolved
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L52-L55'
  - symbol: dataviewToDeckLayerResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L57-L167'
  - symbol: dataviewToDeckLayer
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L169-L175'
---

<!-- context:generated:start -->

## Summary

The resolution pipeline handles both single dataview instances and arrays polymorphically, normalizing them to arrays before processing and delegating type-specific logic to resolver functions.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
