---
name: Session Expiration Handling
slug: session-expiration-handling
type: concept
sources:
  - path: apps/platform/store/middlewares.ts
    hash: d4b06f4a0cd4627ff85382f891eb8f522e9217893cd6f2e240a8039d5577b052
  - path: apps/platform/store/store.ts
    hash: da4b2224a62b42d90700714342ec536094d4085248480c588d0122473981e6cd
sources_digest: 06b3bba324d57506c968258791bbd230d426c0631ebb20916b79b23ac4d8f273
links: []
generator:
  version: 1
covers:
  - symbol: logoutUserMiddleware
    kind: function
    at: 'apps/platform/store/middlewares.ts:L11-L37'
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

Monitors failed refresh token attempts in Redux thunk rejections and automatically dispatches logout action to expire the user session. Checks for authenticated state, refresh errors, and workspace password errors to distinguish session expiration from other failures.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
