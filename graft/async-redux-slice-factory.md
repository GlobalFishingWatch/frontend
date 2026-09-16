---
name: Async Redux Slice Factory
slug: async-redux-slice-factory
type: file
sources:
  - path: apps/platform/utils/async-slice.ts
    hash: eb86ae6108771046df092c3c2cac6df3b136119aab6ef586d6f1fff2a1a1ff8f
  - path: apps/port-labeler/src/utils/async-slice.ts
    hash: a98bd6e84fe7edf9535e0a322232bd04e045f549efda2f0071eefcac554b0920
sources_digest: a87a74332580e9064a442063e5b9c2294ebe2458a01a4e008da6725c1ace33d9
links:
  - to: redux-state-management-for-labeler
    relation: implements
    description: >-
      Labeler slice likely uses createAsyncSlice pattern for managing async data
      loading state
  - to: redux-test-store
    relation: uses
    description: Test store fixtures often override slices created with this factory
generator:
  version: 1
covers:
  - symbol: AsyncReducerStatus
    kind: enum
    at: 'apps/platform/utils/async-slice.ts:L11-L21'
  - symbol: AsyncError
    kind: type
    at: 'apps/platform/utils/async-slice.ts:L23-L25'
  - symbol: AsyncReducerId
    kind: type
    at: 'apps/platform/utils/async-slice.ts:L27-L27'
  - symbol: AsyncReducer
    kind: type
    at: 'apps/platform/utils/async-slice.ts:L28-L35'
  - symbol: getRequestIdsOnStart
    kind: function
    at: 'apps/platform/utils/async-slice.ts:L46-L49'
  - symbol: getRequestIdsOnFinish
    kind: function
    at: 'apps/platform/utils/async-slice.ts:L51-L53'
  - symbol: createAsyncSlice
    kind: function
    at: 'apps/platform/utils/async-slice.ts:L55-L209'
  - symbol: AsyncReducerStatus
    kind: enum
    at: 'apps/port-labeler/src/utils/async-slice.ts:L9-L19'
  - symbol: AsyncError
    kind: type
    at: 'apps/port-labeler/src/utils/async-slice.ts:L21-L25'
  - symbol: AsyncReducerId
    kind: type
    at: 'apps/port-labeler/src/utils/async-slice.ts:L27-L27'
  - symbol: AsyncReducer
    kind: type
    at: 'apps/port-labeler/src/utils/async-slice.ts:L28-L35'
  - symbol: getRequestIdsOnStart
    kind: function
    at: 'apps/port-labeler/src/utils/async-slice.ts:L46-L49'
  - symbol: getRequestIdsOnFinish
    kind: function
    at: 'apps/port-labeler/src/utils/async-slice.ts:L50-L52'
  - symbol: createAsyncSlice
    kind: function
    at: 'apps/port-labeler/src/utils/async-slice.ts:L54-L208'
---

<!-- context:generated:start -->

## Summary

Redux Toolkit factory for building slices that manage normalized async data with lifecycle tracking. Standardizes handling of fetch, create, update, delete operations across the platform with granular AsyncReducerStatus states (LoadingCreate, LoadingUpdate, etc.). Supports parallel async operations by tracking currentRequestIds and only transitioning to Finished when all complete.

## Related

- implements [[redux-state-management-for-labeler]] — Labeler slice likely uses createAsyncSlice pattern for managing async data loading state
- uses [[redux-test-store]] — Test store fixtures often override slices created with this factory

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
