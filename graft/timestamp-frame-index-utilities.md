---
name: Timestamp & Frame Index Utilities
slug: timestamp-frame-index-utilities
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/helpers/timestamps.spec.ts
    hash: 45d83f21d39532ca44c26779e26de78cc8f3591746496cd94ce166da8970facc
  - path: libs/deck-loaders/src/fourwings/helpers/timestamps.ts
    hash: 5d774bb32bc8a65a3003c4e8df264c012774ee8d5d79486d7788d9a42b6a8e23
sources_digest: 94c2e52ead32225139979e441e96d27a2dfc174830449531154a4a10f01475ba
links:
  - to: fourwings-data-types
    relation: depends_on
    description: Operates on FourwingsFeatureProperties and FourwingsInterval types
  - to: temporal-frame-conversion
    relation: uses
    description: Uses CONFIG_BY_INTERVAL to convert frame indices to absolute timestamps
generator:
  version: 1
covers:
  - symbol: getFourwingsSublayerStartFrame
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/timestamps.ts:L6-L12'
  - symbol: getFourwingsValueTimestamp
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/timestamps.ts:L14-L23'
  - symbol: findFourwingsValueIndexByTimestamp
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/timestamps.ts:L25-L46'
  - symbol: FourwingsDateBucket
    kind: type
    at: 'libs/deck-loaders/src/fourwings/helpers/timestamps.ts:L48-L48'
  - symbol: accumulateSublayerValuesByFrame
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/timestamps.ts:L50-L88'
  - symbol: accumulateFourwingsSublayerByFrame
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/timestamps.ts:L90-L127'
---

<!-- context:generated:start -->

## Summary

Derives timestamps and value indices from Fourwings frame-based temporal metadata. Exports getFourwingsSublayerStartFrame (combines tile and sublayer offsets), getFourwingsValueTimestamp (converts frame to absolute timestamp via CONFIG_BY_INTERVAL), findFourwingsValueIndexByTimestamp (linear search for matching value), and two accumulation functions (accumulateSublayerValuesByFrame, accumulateFourwingsSublayerByFrame) that aggregate values into date-bucketed maps while filtering by visibility bounds. These functions materialize timestamps as milliseconds rather than frame indices to support downstream aggregation.

## Related

- depends on [[fourwings-data-types]] — Operates on FourwingsFeatureProperties and FourwingsInterval types
- uses [[temporal-frame-conversion]] — Uses CONFIG_BY_INTERVAL to convert frame indices to absolute timestamps

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
