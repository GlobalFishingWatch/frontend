---
name: Jotai Store Isolation in Tests
slug: jotai-store-isolation-in-tests
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/resolvers.spec.ts
    hash: cda5ae0dc4c529625211dd0791686bf60989f8da797a945069a7966ab8ed27d6
sources_digest: a0f7256bf88e974ae6ce5dab2f963c3a64a4eee3dbba3e41f297741b45766687
links: []
generator:
  version: 1
covers:
  - symbol: createMockDataview
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.spec.ts:L49-L63'
  - symbol: createMockGlobalConfig
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.spec.ts:L65-L79'
  - symbol: createMockDataset
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.spec.ts:L81-L105'
  - symbol: createMockUserDataview
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.spec.ts:L109-L141'
---

<!-- context:generated:start -->

## Summary

Test suite resets Jotai's default store after each test to prevent state leakage between test cases, ensuring isolation when testing resolvers that depend on global state.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
