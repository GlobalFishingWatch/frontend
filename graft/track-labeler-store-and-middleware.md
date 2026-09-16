---
name: Track Labeler Store and Middleware
slug: track-labeler-store-and-middleware
type: system
sources:
  - path: apps/track-labeler/src/store.hooks.ts
    hash: 9d40a22ca2432b4e63fa0048333b4cdca7edf1a1150bb53bfb5dbc66c9dd61dd
  - path: apps/track-labeler/src/store.ts
    hash: 6d950855753aa9b6cdedac95f572970aeff09f41b1afe1d04275760e02f1fb0a
  - path: apps/track-labeler/src/types/redux.types.d.ts
    hash: 7d73b7bf899088b337e7bc8abe8e525218ba27096f0aeea8c80053108e5f213e
sources_digest: fc457b9c885f8b7db585378e32e01da2b1827677c7b226fa9f7d39a4c798c4f8
links:
  - to: track-labeler-routing
    relation: uses
    description: >-
      Store applies connectedRoutes middleware and enhancer for URL-to-Redux
      synchronization
  - to: track-labeler-user-authentication
    relation: depends_on
    description: >-
      routerRefreshTokenMiddleware reads user token expiration and triggers
      login thunk before routing
generator:
  version: 1
covers:
  - symbol: useAppDispatch
    kind: function
    at: 'apps/track-labeler/src/store.hooks.ts:L5-L5'
  - symbol: RootState
    kind: type
    at: 'apps/track-labeler/src/store.ts:L58-L58'
  - symbol: AppThunk
    kind: type
    at: 'apps/track-labeler/src/store.ts:L59-L64'
  - symbol: TypedDispatch
    kind: type
    at: 'apps/track-labeler/src/store.ts:L65-L65'
  - symbol: AppDispatch
    kind: type
    at: 'apps/track-labeler/src/store.ts:L66-L66'
  - symbol: AppActions
    kind: type
    at: 'apps/track-labeler/src/types/redux.types.d.ts:L4-L4'
  - symbol: AppState
    kind: type
    at: 'apps/track-labeler/src/types/redux.types.d.ts:L5-L5'
  - symbol: Store
    kind: type
    at: 'apps/track-labeler/src/types/redux.types.d.ts:L8-L8'
  - symbol: RootState
    kind: type
    at: 'apps/track-labeler/src/types/redux.types.d.ts:L10-L10'
  - symbol: RootAction
    kind: type
    at: 'apps/track-labeler/src/types/redux.types.d.ts:L12-L12'
  - symbol: Types
    kind: interface
    at: 'apps/track-labeler/src/types/redux.types.d.ts:L14-L16'
---

<!-- context:generated:start -->

## Summary

Configures the Redux store with 8 feature slices, custom middlewares for router and token refresh, and special handling for large datasets (vessels, resources). Disables serializableCheck to accommodate redux-first-router.

## Related

- uses [[track-labeler-routing]] — Store applies connectedRoutes middleware and enhancer for URL-to-Redux synchronization
- depends on [[track-labeler-user-authentication]] — routerRefreshTokenMiddleware reads user token expiration and triggers login thunk before routing

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
