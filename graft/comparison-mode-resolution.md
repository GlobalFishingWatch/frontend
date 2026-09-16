---
name: Comparison Mode Resolution
slug: comparison-mode-resolution
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/dataviews.ts
    hash: 0d42273406e9a91e1e3b1dcfe757667707437757a57be3d15649496ba0e59c73
sources_digest: 186ea4e8073fdf98a2ceab9c5d2c27d81cf40372e921cc56bda462d67e8d2b7b
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
---

<!-- context:generated:start -->

## Summary

Dataview resolution applies category-specific visualization modes (TimeCompare, Bivariate, or Compare) to determine layer composition and styling, with fallback to default comparison mode.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
