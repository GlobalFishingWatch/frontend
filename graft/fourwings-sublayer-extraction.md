---
name: Fourwings Sublayer Extraction
slug: fourwings-sublayer-extraction
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/dataviews.spec.ts
    hash: eb0d8d457536df8286fa96b94117f320c5c8cc370f24abeb996942557b872388
  - path: libs/deck-layer-composer/src/resolvers/dataviews.ts
    hash: 0d42273406e9a91e1e3b1dcfe757667707437757a57be3d15649496ba0e59c73
sources_digest: cadf7f995e8316186a4305b8b392adadc1b1367eb9b735fc32abaee0819cbb94
links:
  - to: api-type-system
    relation: depends_on
    description: >-
      Uses api-types enums and Dataset/DataviewInstance types for dataset
      classification and filtering
  - to: color-ramp-configuration
    relation: depends_on
    description: >-
      Falls back to default color ramps when multi-hue ramps aren't supported by
      the dataset
generator:
  version: 1
covers:
  - symbol: createDataset
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.spec.ts:L16-L24'
  - symbol: createDataview
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.spec.ts:L26-L39'
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

Extracts and configures individual sublayers from Fourwings datasets, filtering by import status, aggregating metadata, and propagating visual properties like value ranges and color ramps across sublayers.

## Related

- depends on [[api-type-system]] — Uses api-types enums and Dataset/DataviewInstance types for dataset classification and filtering
- depends on [[color-ramp-configuration]] — Falls back to default color ramps when multi-hue ramps aren't supported by the dataset

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
