---
name: Fourwings Aggregation Migration
slug: fourwings-aggregation-migration
type: concept
sources:
  - path: >-
      libs/deck-loaders/src/fourwings/helpers/fourwings-graph-aggregation.spec.ts
    hash: 11d745cb106f7928ecea423d81e53bf9e871cd93abf0eab09a09cf1a764f4b8c
  - path: libs/deck-loaders/src/fourwings/helpers/timestamps.ts
    hash: 5d774bb32bc8a65a3003c4e8df264c012774ee8d5d79486d7788d9a42b6a8e23
  - path: libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts
    hash: ff619edc49e3769317a98eaa798ab2730fa677a1b2eacd5990d5e7904a0eb581
sources_digest: c35135b4769fd0bce9b008457ac5705720db78fe5c91dbe3d30749a68db3fec5
links:
  - to: temporal-frame-conversion
    relation: depends_on
    description: >-
      Relies on CONFIG_BY_INTERVAL to derive timestamps without stored date
      arrays
  - to: timestamp-frame-index-utilities
    relation: implements
    description: >-
      Implements timestamp materialization functions that support the
      aggregation migration
generator:
  version: 1
covers:
  - symbol: createDateMap
    kind: function
    at: >-
      libs/deck-loaders/src/fourwings/helpers/fourwings-graph-aggregation.spec.ts:L16-L23
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
  - symbol: isFourwingsNoDataValue
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L15-L17'
  - symbol: descaleFourwingsValue
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L23-L29'
  - symbol: getCellTimeseries
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L36-L178'
  - symbol: getCellTemporalAggregated
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L184-L258'
  - symbol: parseFourwings
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L260-L277'
---

<!-- context:generated:start -->

## Summary

Design decision to remove pre-computed date arrays from tiles and derive timestamps on-the-fly during parsing using interval configurations from CONFIG_BY_INTERVAL. Reduces tile payload size at the cost of runtime computation. Validated by fourwings-graph-aggregation.spec.ts which confirms that derived-timestamp aggregation (accumulateSublayerValuesByFrame, accumulateFourwingsSublayerByFrame, getFourwingsValueTimestamp) matches legacy dates-based aggregation for backward compatibility.

## Related

- depends on [[temporal-frame-conversion]] — Relies on CONFIG_BY_INTERVAL to derive timestamps without stored date arrays
- implements [[timestamp-frame-index-utilities]] — Implements timestamp materialization functions that support the aggregation migration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
