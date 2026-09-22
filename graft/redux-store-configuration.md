---
name: Redux Store Configuration
slug: redux-store-configuration
type: system
sources:
  - path: apps/platform/store/middlewares.ts
    hash: d4b06f4a0cd4627ff85382f891eb8f522e9217893cd6f2e240a8039d5577b052
  - path: apps/platform/store/reducers.ts
    hash: 402624264de0ac78cb1d1d0a355833dc7af072e4ab704ddd2aee3d7d45aa2eee
  - path: apps/platform/store/store.ts
    hash: da4b2224a62b42d90700714342ec536094d4085248480c588d0122473981e6cd
sources_digest: 519444e59fd212a5345f6d1b943e1cb0319441dd3ab52f4dad3b6b0c3df09186
links:
  - to: session-expiration-handling
    relation: part_of
    description: >-
      logoutUserMiddleware intercepts refresh token rejections and dispatches
      setLoginExpired action
  - to: state-shape-and-persistence
    relation: implements
    description: >-
      store.ts and reducers.ts define the root state shape via combineSlices;
      store.dehydrated-state.ts manages SSR hydration
generator:
  version: 1
covers:
  - symbol: logoutUserMiddleware
    kind: function
    at: 'apps/platform/store/middlewares.ts:L11-L37'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/store/reducers.ts:L33-L33'
  - symbol: RootState
    kind: type
    at: 'apps/platform/store/reducers.ts:L60-L60'
  - symbol: makeStore
    kind: function
    at: 'apps/platform/store/store.ts:L38-L73'
  - symbol: AppStore
    kind: type
    at: 'apps/platform/store/store.ts:L75-L75'
  - symbol: TypedDispatch
    kind: type
    at: 'apps/platform/store/store.ts:L76-L76'
  - symbol: AppDispatch
    kind: type
    at: 'apps/platform/store/store.ts:L78-L78'
  - symbol: AppThunk
    kind: type
    at: 'apps/platform/store/store.ts:L79-L84'
  - symbol: RootState
    kind: type
    at: 'apps/platform/store/store.ts:L86-L86'
---

<!-- context:generated:start -->

## Summary

Configures a Redux store factory with combineSlices reducer pattern supporting lazy-loaded feature slices. Skips serialization and immutability checks on large entity caches (resources, datasets, dataviews) and chains middleware for async queries and session management. DevTools enabled in development with custom sanitizer for debugging.

## Related

- part of [[session-expiration-handling]] — logoutUserMiddleware intercepts refresh token rejections and dispatches setLoginExpired action
- implements [[state-shape-and-persistence]] — store.ts and reducers.ts define the root state shape via combineSlices; store.dehydrated-state.ts manages SSR hydration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
