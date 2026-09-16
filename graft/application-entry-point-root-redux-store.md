---
name: Application Entry Point & Root Redux Store
slug: application-entry-point-root-redux-store
type: system
sources:
  - path: apps/port-labeler/src/index.tsx
    hash: 79c51686d68d8b3af913c019f3ae8d361a9e7cd529a66a82ac40c8278bc98652
  - path: apps/port-labeler/src/store.ts
    hash: c83012d4ba4d89ab7b3cde1149f09fcb43ccf09d1480ce3ea44d00d3882691a5
sources_digest: 26a2fcd4a1b4e836bbd9f4a0098d578a3814bf0a33508e37450f7dcaa0e936da
links:
  - to: interactive-map-rendering-viewport-state
    relation: uses
    description: MapProvider wraps App to enable map functionality across component tree
  - to: redux-state-management-for-labeler
    relation: uses
    description: Store integrates labelerReducer as primary feature reducer
  - to: url-routing-query-parameter-synchronization
    relation: uses
    description: >-
      Store integrates location state via redux-first-router and wires routing
      middleware
  - to: user-authentication-permissions
    relation: uses
    description: Store integrates userReducer for auth state management
generator:
  version: 1
covers:
  - symbol: RootState
    kind: type
    at: 'apps/port-labeler/src/store.ts:L54-L54'
  - symbol: AppDispatch
    kind: type
    at: 'apps/port-labeler/src/store.ts:L55-L55'
  - symbol: AppThunk
    kind: type
    at: 'apps/port-labeler/src/store.ts:L56-L61'
---

<!-- context:generated:start -->

## Summary

index.tsx bootstraps the React app with Redux Provider and MapProvider, wrapping App component. store.ts configures Redux store combining labelerReducer, userReducer, titleReducer with location state from redux-first-router integration; disables serialization checks for compatibility, includes devTools sanitizer for large resource data, and wires routerQueryMiddleware and routerMiddleware for routing state management.

## Related

- uses [[interactive-map-rendering-viewport-state]] — MapProvider wraps App to enable map functionality across component tree
- uses [[redux-state-management-for-labeler]] — Store integrates labelerReducer as primary feature reducer
- uses [[url-routing-query-parameter-synchronization]] — Store integrates location state via redux-first-router and wires routing middleware
- uses [[user-authentication-permissions]] — Store integrates userReducer for auth state management

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
