---
name: Temporal Frame Conversion
slug: temporal-frame-conversion
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/helpers/time.spec.ts
    hash: 5829cf6ac7fb347f9b07ec4def15f86944a3e3714e87cb360850a7e0f1484383
  - path: libs/deck-loaders/src/fourwings/helpers/time.ts
    hash: 98aead7581b2a6def38dd962f8aa7e82cdf077a408b740b4735cc09126981c34
sources_digest: 2f7c8e77ee0bef5541d15bc594b5fd7a0b745b3c6688e60478571988abe869f7
links:
  - to: temporal-utilities
    relation: uses
    description: Uses Luxon DateTime for ISO parsing and duration arithmetic
generator:
  version: 1
covers:
  - symbol: getFourwingsInterval
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/time.ts:L32-L62'
  - symbol: getTimeRangeKey
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/time.ts:L109-L111'
---

<!-- context:generated:start -->

## Summary

Bidirectional converters between frame numbers (discrete time buckets) and millisecond timestamps for multiple interval granularities (HOUR, DAY, MONTH, YEAR). Exports CONFIG_BY_INTERVAL with interval-specific getIntervalTimestamp and getIntervalFrame functions, plus getFourwingsInterval which intelligently selects the appropriate interval based on time range duration (HOUR for <3 days, DAY for <3 months, MONTH for <3 years, YEAR for longer). Handles calendar-aware conversions for MONTH and YEAR via UTC date arithmetic; uses linear frame numbering that may produce off-by-one edge cases around epoch boundaries.

## Related

- uses [[temporal-utilities]] — Uses Luxon DateTime for ISO parsing and duration arithmetic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
