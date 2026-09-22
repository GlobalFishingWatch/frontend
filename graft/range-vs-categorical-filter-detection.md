---
name: range vs. categorical filter detection
slug: range-vs-categorical-filter-detection
type: concept
sources:
  - path: libs/deck-loaders/src/user/lib/features.utils.spec.ts
    hash: 3bef23ed6f9081289565b358c7a168c275e706e6744de106e585d0cb3198e163
  - path: libs/deck-loaders/src/user/lib/features.utils.ts
    hash: 0f194b09fa42aebb6a8f762870a082ffe61919e1db476fe9c71f1068b0f31af7
sources_digest: 5cb444b628728aa4b0aaaa87da96e82b80f2db16dbeff52a3fb17e1168e4b2f4
links:
  - to: feature-filtering-system
    relation: part_of
    description: >-
      isFeatureInFilter distinguishes range and categorical filters via
      structural inspection
generator:
  version: 1
covers:
  - symbol: FilterOperators
    kind: type
    at: 'libs/deck-loaders/src/user/lib/features.utils.ts:L3-L3'
  - symbol: isNumeric
    kind: function
    at: 'libs/deck-loaders/src/user/lib/features.utils.ts:L5-L9'
  - symbol: isFeatureInFilter
    kind: function
    at: 'libs/deck-loaders/src/user/lib/features.utils.ts:L11-L40'
  - symbol: isFeatureInFilters
    kind: function
    at: 'libs/deck-loaders/src/user/lib/features.utils.ts:L42-L51'
---

<!-- context:generated:start -->

## Summary

Filters are distinguished by structure: two numeric values in the values array indicate a range filter (min/max); otherwise, it's a categorical list filter. The exclude operator only applies to categorical filters; range filters lack an exclude mode. Special handling for protected_seas.removal_of field which comes as string despite appearing numeric.

## Related

- part of [[feature-filtering-system]] — isFeatureInFilter distinguishes range and categorical filters via structural inspection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
