---
name: React Context Safety Pattern
slug: react-context-safety-pattern
type: concept
sources:
  - path: libs/timebar/src/utils/create-guarded-context.ts
    hash: ce548c4a6e43b4721191b9da2d328b63ece904a0722a546aaa9367f9fff53f53
sources_digest: 3ba77a676eb1d3d8b88e7995659572640caf7c078aab6901a5186d11fdd5f4e9
links:
  - to: timebar-utilities-helpers
    relation: part_of
    description: >-
      createGuardedContext is a utility exported from timebar utils for safe
      context creation across the library
generator:
  version: 1
covers:
  - symbol: createGuardedContext
    kind: function
    at: 'libs/timebar/src/utils/create-guarded-context.ts:L3-L13'
  - symbol: useGuardedContext
    kind: function
    at: 'libs/timebar/src/utils/create-guarded-context.ts:L5-L11'
---

<!-- context:generated:start -->

## Summary

Factory pattern (createGuardedContext) for creating typed React contexts that enforce usage within a specific provider boundary. The custom hook returned by the factory checks whether the context value is null and throws a descriptive error if called outside the provider, with provider name and hook name baked into the message. This prevents silent null reference bugs and guides developers to correct context placement.

## Related

- part of [[timebar-utilities-helpers]] — createGuardedContext is a utility exported from timebar utils for safe context creation across the library

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
