---
name: Temporal Data Handling
slug: temporal-data-handling
type: system
sources:
  - path: libs/data-transforms/src/dates/dates.ts
    hash: 8b1841bb69eaf53fcb170e61f353b1cb9cec1c83310f847af2f602cddde65f1f
  - path: libs/data-transforms/src/dates/index.ts
    hash: 01bd9e708c99c4fafc10042fb5e568eded63067319cf60f532865ef7eeaf779c
sources_digest: 70b8c4e091bd80d92e4d22102a7c4b4c056ec42be1f676fc1e75e0b077de85a2
links:
  - to: track-segment-processing-pipeline
    relation: uses
    description: >-
      Track segment conversion and filtering use getUTCDate for flexible
      timestamp parsing and temporal ordering
generator:
  version: 1
covers:
  - symbol: DateTimeParseFunction
    kind: type
    at: 'libs/data-transforms/src/dates/dates.ts:L8-L8'
  - symbol: makeFormatParsers
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L24-L30'
  - symbol: detectCandidates
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L47-L53'
  - symbol: getUTCDate
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L55-L80'
  - symbol: SupportedDateType
    kind: type
    at: 'libs/data-transforms/src/dates/dates.ts:L81-L81'
  - symbol: getUTCDateTime
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L82-L129'
  - symbol: getISODateByInterval
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L131-L151'
  - symbol: formatDateForInterval
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L153-L177'
  - symbol: StickToClosestIntervalParams
    kind: type
    at: 'libs/data-transforms/src/dates/dates.ts:L179-L182'
  - symbol: stickToClosestInterval
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L183-L201'
  - symbol: getClosestIntervalDate
    kind: function
    at: 'libs/data-transforms/src/dates/dates.ts:L185-L192'
---

<!-- context:generated:start -->

## Summary

Comprehensive date parsing and formatting system (dates module) using Luxon with regex-based format detection (ISO/SQL, RFC2822, slash/dash-delimited patterns) and graceful fallback to UTC epoch on parse failure. Additional utilities (getISODateByInterval, formatDateForInterval, stickToClosestInterval) normalize DateTime objects to ISO strings or human-readable formats based on FourwingsInterval time units (YEAR, MONTH, DAY, HOUR), enabling temporal bucketing and interval snapping for time-series data.

## Related

- uses [[track-segment-processing-pipeline]] — Track segment conversion and filtering use getUTCDate for flexible timestamp parsing and temporal ordering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
