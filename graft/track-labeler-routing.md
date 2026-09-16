---
name: Track Labeler Routing
slug: track-labeler-routing
type: system
sources:
  - path: apps/track-labeler/src/routes/routes.actions.ts
    hash: 61b464b48659185d62705ed7861ee560e5c0c377a708c477ff625947e2f4715a
  - path: apps/track-labeler/src/routes/routes.middlewares.ts
    hash: 3a49439224fa6fcd1da5bba2a921397c1332176a34bfd3f44a6d640bc692d864
  - path: apps/track-labeler/src/routes/routes.selectors.ts
    hash: e67b5eafc2aeae134265ca2925a8193bfd69bbac2e647535a2caefb10b97b177
  - path: apps/track-labeler/src/routes/routes.ts
    hash: 99aef2727ce1f68d052f8e8d1b07cc36d1df640c267c7d296aced0f7799c377a
sources_digest: 7a91a0f01013a32cd460deef723ee2244d5499e479b3f3bc0238bca75f93522d
links:
  - to: query-driven-state-synchronization
    relation: implements
    description: >-
      Routes system encodes/decodes workspace state via encodeWorkspace and
      decodeWorkspace; routerQueryMiddleware merges URL params into Redux state
  - to: track-labeler-user-authentication
    relation: depends_on
    description: >-
      Routes thunk checks user login via checkUserLoggedThunk; routing
      middlewares refresh tokens before navigation
  - to: track-labeler-vessel-metadata
    relation: uses
    description: >-
      Routes thunk pre-fetches vessel info and track data via vesselInfoThunk
      and trackThunk on authenticated navigation
generator:
  version: 1
covers:
  - symbol: UpdateQueryParamsAction
    kind: interface
    at: 'apps/track-labeler/src/routes/routes.actions.ts:L5-L14'
  - symbol: updateQueryParams
    kind: function
    at: 'apps/track-labeler/src/routes/routes.actions.ts:L16-L18'
  - symbol: routerQueryMiddleware
    kind: function
    at: 'apps/track-labeler/src/routes/routes.middlewares.ts:L10-L31'
  - symbol: routerRefreshTokenMiddleware
    kind: function
    at: 'apps/track-labeler/src/routes/routes.middlewares.ts:L33-L50'
  - symbol: selectLocation
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L11-L13'
  - symbol: selectQueryParam
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L22-L28'
  - symbol: thunk
    kind: function
    at: 'apps/track-labeler/src/routes/routes.ts:L21-L45'
  - symbol: encodeWorkspace
    kind: function
    at: 'apps/track-labeler/src/routes/routes.ts:L77-L79'
  - symbol: decodeWorkspace
    kind: function
    at: 'apps/track-labeler/src/routes/routes.ts:L81-L92'
---

<!-- context:generated:start -->

## Summary

Maps application URLs to Redux state and enforces authentication checkpoints using redux-first-router. Serializes query parameters (viewport, filters, workspace) into the URL and deserializes them back into Redux state for bookmarkable application views.

## Related

- implements [[query-driven-state-synchronization]] — Routes system encodes/decodes workspace state via encodeWorkspace and decodeWorkspace; routerQueryMiddleware merges URL params into Redux state
- depends on [[track-labeler-user-authentication]] — Routes thunk checks user login via checkUserLoggedThunk; routing middlewares refresh tokens before navigation
- uses [[track-labeler-vessel-metadata]] — Routes thunk pre-fetches vessel info and track data via vesselInfoThunk and trackThunk on authenticated navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
