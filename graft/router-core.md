---
name: Router Core
slug: router-core
type: system
sources:
  - path: apps/platform/router.tsx
    hash: cb9b012088ae178e5475f021c660898ff050b03f31db6bdfd706a28a267d1d25
  - path: apps/platform/router/app-router-context.ts
    hash: 3d819b23eb1962099585b4c03c91803beb6e85de89640df5c1dffb3c6ca350a0
  - path: apps/platform/router/router-ref.ts
    hash: cb49c63dcc3ce47dc02bdb364c75a38e8b7575e1cf8a2cc71e19420dd4ef52cd
sources_digest: 3074555a21c35db706c89c98a317edfa014c3c2fc14116e29ca40817a2de5ddf
links:
  - to: navigation-guards
    relation: depends_on
    description: >-
      Router decorators use these hooks to intercept navigation and show
      confirmation dialogs
  - to: route-configuration
    relation: depends_on
    description: >-
      Router imports routeTree.gen for route definitions and makeStore for Redux
      integration
  - to: route-synchronization
    relation: uses
    description: >-
      Router instance is accessed via getRouterRef and synchronized to Redux
      state by router-sync
generator:
  version: 1
covers:
  - symbol: parseAppWorkspace
    kind: function
    at: 'apps/platform/router.tsx:L20-L22'
  - symbol: normalizeSearchString
    kind: function
    at: 'apps/platform/router.tsx:L24-L30'
  - symbol: stringifyAppWorkspace
    kind: function
    at: 'apps/platform/router.tsx:L32-L35'
  - symbol: getCreateRouterOptions
    kind: function
    at: 'apps/platform/router.tsx:L40-L58'
  - symbol: createAppRouter
    kind: function
    at: 'apps/platform/router.tsx:L60-L72'
  - symbol: AppRouter
    kind: type
    at: 'apps/platform/router.tsx:L74-L74'
  - symbol: getRouter
    kind: function
    at: 'apps/platform/router.tsx:L77-L95'
  - symbol: AppRouterContext
    kind: type
    at: 'apps/platform/router/app-router-context.ts:L3-L5'
  - symbol: getAppRouterStore
    kind: function
    at: 'apps/platform/router/app-router-context.ts:L7-L9'
  - symbol: setRouterRef
    kind: function
    at: 'apps/platform/router/router-ref.ts:L5-L7'
  - symbol: getRouterRef
    kind: function
    at: 'apps/platform/router/router-ref.ts:L9-L11'
---

<!-- context:generated:start -->

## Summary

TanStack Router implementation for the platform, handling client-side navigation with custom workspace parameter serialization and store integration. Provides factory functions for router creation (getCreateRouterOptions, createAppRouter) with Redux dehydration, SSR consistency via sorted URLSearchParams normalization, and conditional Sentry integration in production non-SSR contexts. Routes unknown paths to MAP view by default.

## Related

- depends on [[navigation-guards]] — Router decorators use these hooks to intercept navigation and show confirmation dialogs
- depends on [[route-configuration]] — Router imports routeTree.gen for route definitions and makeStore for Redux integration
- uses [[route-synchronization]] — Router instance is accessed via getRouterRef and synchronized to Redux state by router-sync

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
