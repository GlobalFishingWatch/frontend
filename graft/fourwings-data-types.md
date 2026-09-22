---
name: Fourwings Data Types
slug: fourwings-data-types
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/lib/types.ts
    hash: 18a649d1bd96bb3fefd14883354131030b9c3606f3c44a382d00f6d21fdb7dc2
sources_digest: 55fb1b854cd5b6b625a034c956968ef3fa2447a8b6738df46d5693212937410d
links: []
generator:
  version: 1
covers:
  - symbol: FourwingsRawData
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L5-L5'
  - symbol: FourwingsTileData
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L7-L11'
  - symbol: Cell
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L13-L13'
  - symbol: TileCell
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L15-L17'
  - symbol: FourwingsInterval
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L19-L19'
  - symbol: FourwingsAggregationOperation
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L20-L20'
  - symbol: ParseFourwingsOptions
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L22-L41'
  - symbol: ParseFourwingsClustersOptions
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L43-L48'
  - symbol: FourwingsVectorsUnit
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L49-L49'
  - symbol: ParseFourwingsVectorsOptions
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L50-L53'
  - symbol: FourwingsLoaderOptions
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L55-L57'
  - symbol: FourwingsClustersLoaderOptions
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L59-L61'
  - symbol: FourwingsVectorsLoaderOptions
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L63-L65'
  - symbol: FourwingsFeatureValues
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L67-L67'
  - symbol: FourwingsFeatureProperties
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L68-L86'
  - symbol: FourwingsPositionFeatureProperties
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L88-L93'
  - symbol: FourwingsPointFeatureProperties
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L95-L101'
  - symbol: FourwingsFeature
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L103-L109'
  - symbol: FourwingsValuesAndStartFrameFeature
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L113-L113'
  - symbol: FourwingsPositionFeature
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L114-L114'
  - symbol: FourwingsPointFeature
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/types.ts:L115-L115'
---

<!-- context:generated:start -->

## Summary

Complete TypeScript schema for Fourwings loader ecosystem, defining contracts for parsing gridded environmental data across temporal intervals. Core types include FourwingsRawData (raw number arrays), FourwingsTileData (parsed grids), and Cell geometry. Temporal dimension controlled by FourwingsInterval ('HOUR'|'DAY'|'MONTH'|'YEAR') and aggregation strategies. Specialized option types (ParseFourwingsClustersOptions, ParseFourwingsVectorsOptions) drop irrelevant fields and add domain-specific props (FourwingsVectorsUnit for wind conversion). Feature types (FourwingsFeature, FourwingsPointFeature) model output with cellId, initialValues, startOffsets, tileStartFrame for timestamp derivation, and optional velocities/directions.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
