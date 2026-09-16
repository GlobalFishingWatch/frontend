---
name: Temporal Utilities
slug: temporal-utilities
type: system
sources:
  - path: libs/deck-layers/src/utils/dates.ts
    hash: 3d0f6667ecb3f2d180e16f2928c3f573fdceb1a024106f2a10370f0537fb7bfc
sources_digest: 4dee674de6bd2de330b16270b0a5dc62b069e0ec14774d528ac6774fe8515095
links: []
generator:
  version: 1
covers:
  - symbol: getUTCDateTime
    kind: function
    at: 'libs/deck-layers/src/utils/dates.ts:L4-L7'
  - symbol: getTimeRangeDuration
    kind: function
    at: 'libs/deck-layers/src/utils/dates.ts:L9-L19'
---

<!-- context:generated:start -->

## Summary

Date and time handling for the deck-layers library, wrapping Luxon's DateTime API for UTC-focused operations. Provides getUTCDateTime for parsing ISO strings or millisecond timestamps and getTimeRangeDuration for computing elapsed time between ranges with configurable units, supporting intervals from milliseconds to years. Note: contains a minor bug where start/end validation checks start field twice.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
