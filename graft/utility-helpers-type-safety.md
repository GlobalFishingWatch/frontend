---
name: Utility Helpers & Type Safety
slug: utility-helpers-type-safety
type: system
sources:
  - path: apps/port-labeler/src/utils/colors.ts
    hash: 4af3718f1173a514d792326041bde42c57635d176f4e4dbf275d03842ae80077
  - path: apps/port-labeler/src/utils/dates.ts
    hash: d6d68cdf382495e9b279f2b0ff1cd537e954aa82e13cc83c48e3e59f1c80529c
  - path: apps/port-labeler/src/utils/group-by.ts
    hash: b2e6ed792cdd5c2c6d675f9661204901af09f6e061822f512259fb8a694bea7a
  - path: apps/port-labeler/src/utils/selectors.ts
    hash: 2e15653005eb1549934686568adb4ccb4969627a271ab7047d5c5903e81a1f0f
sources_digest: 5c0709b4eb564553293672696571f158ae660901f04ab70fc075642f2ebca8dd
links:
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      createDeepEqualSelector enables memoized selectors for complex filtered
      state; selectors used throughout labeler slice and components
generator:
  version: 1
covers:
  - symbol: typedKeys
    kind: function
    at: 'apps/port-labeler/src/utils/colors.ts:L1-L4'
  - symbol: getFixedColorForUnknownLabel
    kind: function
    at: 'apps/port-labeler/src/utils/colors.ts:L37-L44'
  - symbol: getUTCDateTime
    kind: function
    at: 'apps/port-labeler/src/utils/dates.ts:L4-L7'
  - symbol: getTimeRangeDuration
    kind: function
    at: 'apps/port-labeler/src/utils/dates.ts:L9-L18'
  - symbol: groupBy
    kind: function
    at: 'apps/port-labeler/src/utils/group-by.ts:L3-L15'
---

<!-- context:generated:start -->

## Summary

Collection of utility modules providing deep equality selectors (createDeepEqualSelector via reselect + lodash), date/time conversions (getUTCDateTime, getTimeRangeDuration via Luxon with UTC anchoring), grouping by mapped identifiers (groupBy for PortPosition aggregation), and type-safe object key extraction (typedKeys). These support Redux selector memoization, temporal calculations, data organization, and TypeScript safety across the application.

## Related

- uses [[redux-state-management-for-labeler]] — createDeepEqualSelector enables memoized selectors for complex filtered state; selectors used throughout labeler slice and components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
