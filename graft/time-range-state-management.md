---
name: Time Range State Management
slug: time-range-state-management
type: file
sources:
  - path: libs/timebar/src/timebar-range.spec.tsx
    hash: 6ac93b10087c0d7f0aa910384e08e5cb97b115a0f794a9f557bb503019ece6b1
  - path: libs/timebar/src/timebar-range.ts
    hash: 1713134603063764cd064497a620b8688158a12d1b8cd07822844e6bc278cdf7
sources_digest: 959e68499b2a6815c4578959a0b4a7b3d089d132677d9698145c1f7906ea01da
links:
  - to: playback-control-system
    relation: implements
    description: >-
      The hook's notifyChange callback drives playback frame stepping and emits
      events tagged with EVENT_SOURCE.PLAYBACK_FRAME
  - to: time-representation-conventions
    relation: implements
    description: >-
      All range values are ISO date strings; clampToMinAndMax uses getUTCDate
      for safe date arithmetic respecting millisecond bounds
generator:
  version: 1
covers:
  - symbol: Range
    kind: type
    at: 'libs/timebar/src/timebar-range.ts:L7-L7'
  - symbol: clampToMinAndMax
    kind: function
    at: 'libs/timebar/src/timebar-range.ts:L13-L37'
  - symbol: UseTimebarRangeParams
    kind: type
    at: 'libs/timebar/src/timebar-range.ts:L39-L45'
  - symbol: useTimebarRange
    kind: function
    at: 'libs/timebar/src/timebar-range.ts:L47-L91'
---

<!-- context:generated:start -->

## Summary

useTimebarRange hook manages synchronized start/end dates with minimum/maximum duration constraints and sophisticated feedback-loop detection. Uses an 'echo buffer' (emittedRef) to distinguish parent prop echoes from genuine external range changes, preventing snap-back bugs during playback or user interaction.

## Related

- implements [[playback-control-system]] — The hook's notifyChange callback drives playback frame stepping and emits events tagged with EVENT_SOURCE.PLAYBACK_FRAME
- implements [[time-representation-conventions]] — All range values are ISO date strings; clampToMinAndMax uses getUTCDate for safe date arithmetic respecting millisecond bounds

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
