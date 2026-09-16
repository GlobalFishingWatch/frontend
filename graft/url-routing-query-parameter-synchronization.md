---
name: URL Routing & Query Parameter Synchronization
slug: url-routing-query-parameter-synchronization
type: system
sources:
  - path: apps/port-labeler/src/routes/routes.actions.ts
    hash: f698cbb67cb491779fa9c9d7560114dd2b439fef00759781c5ab6f6137f70009
  - path: apps/port-labeler/src/routes/routes.hook.ts
    hash: 0b830a5255bf768e610c535e19cfc15e643b3b0acece50c918dcb17c5c95a80b
  - path: apps/port-labeler/src/routes/routes.middlewares.ts
    hash: 1f8e923e3c130133622d1db50ff5a902448eeb92fa3912a6809427ef05c21003
  - path: apps/port-labeler/src/routes/routes.selectors.ts
    hash: 4ce8cc9d978130c24ba8b44bc078dc7e6425fd53f464c81b7444809d91f06e93
  - path: apps/port-labeler/src/routes/routes.ts
    hash: 34499f008b11c826173783eff566e388575f2cbc2aee5148e2469c29e2ab1455
sources_digest: a818d5969012854d85a1931b65b9d72d406263ea43531f293feefa8f95734963
links:
  - to: interactive-map-rendering-viewport-state
    relation: configures
    description: >-
      selectUrlViewport selector provides map zoom/lat/long initialization;
      updateUrlViewport thunk persists viewport changes to URL
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      Route state selectors (selectUrlViewport, selectUrlTimeRange) provide
      initial map bounds and time filtering; route middleware preserves these
      across navigation
generator:
  version: 1
covers:
  - symbol: UpdateQueryParamsAction
    kind: interface
    at: 'apps/port-labeler/src/routes/routes.actions.ts:L14-L25'
  - symbol: UpdateLocationOptions
    kind: type
    at: 'apps/port-labeler/src/routes/routes.actions.ts:L27-L27'
  - symbol: updateQueryParams
    kind: function
    at: 'apps/port-labeler/src/routes/routes.actions.ts:L29-L31'
  - symbol: updateLocation
    kind: function
    at: 'apps/port-labeler/src/routes/routes.actions.ts:L32-L37'
  - symbol: cleanQueryLocation
    kind: function
    at: 'apps/port-labeler/src/routes/routes.actions.ts:L39-L48'
  - symbol: updateUrlViewport
    kind: function
    at: 'apps/port-labeler/src/routes/routes.actions.ts:L51-L58'
  - symbol: updateUrlTimerange
    kind: function
    at: 'apps/port-labeler/src/routes/routes.actions.ts:L60-L68'
  - symbol: useReplaceLoginUrl
    kind: function
    at: 'apps/port-labeler/src/routes/routes.hook.ts:L19-L50'
  - symbol: useLocationConnect
    kind: function
    at: 'apps/port-labeler/src/routes/routes.hook.ts:L52-L65'
  - symbol: routerQueryMiddleware
    kind: function
    at: 'apps/port-labeler/src/routes/routes.middlewares.ts:L12-L49'
  - symbol: selectLocation
    kind: function
    at: 'apps/port-labeler/src/routes/routes.selectors.ts:L10-L10'
  - symbol: selectQueryParam
    kind: function
    at: 'apps/port-labeler/src/routes/routes.selectors.ts:L26-L29'
  - symbol: ROUTE_TYPES
    kind: type
    at: 'apps/port-labeler/src/routes/routes.ts:L9-L9'
---

<!-- context:generated:start -->

## Summary

Redux-first-router integration managing HOME route and URL query parameters (zoom, latitude, longitude, satellite mode, sidebar toggle, timerange). routesMiddleware intercepts navigation actions, preserves prior query state, and flags redirects for certain parameters. Selectors extract individual params with DEFAULT_WORKSPACE fallbacks; hooks sync post-login redirects and provide dispatch interface for components to update URL state.

## Related

- configures [[interactive-map-rendering-viewport-state]] — selectUrlViewport selector provides map zoom/lat/long initialization; updateUrlViewport thunk persists viewport changes to URL
- uses [[redux-state-management-for-labeler]] — Route state selectors (selectUrlViewport, selectUrlTimeRange) provide initial map bounds and time filtering; route middleware preserves these across navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
