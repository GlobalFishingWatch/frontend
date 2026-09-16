---
name: Router Integration
slug: router-integration
type: concept
sources:
  - path: apps/platform/features/app/app-store.hooks.ts
    hash: 2b45ec7e93d17dc27e11c7b1baba46adfb51bf5c43284488be1a26994130f9b3
sources_digest: dc13018c80701339f79df184a4d4c32aac95417cf83712dd851a72afe2cfbe1b
links:
  - to: analytics-tracking
    relation: produces
    description: Route type derived via mapRoutePathToType feeds analytics tracking context
  - to: workspace-map-data
    relation: uses
    description: >-
      Router state drives map navigation and workspace selection;
      setupRouterSync bidirectionally syncs route params with Redux workspace
      state
generator:
  version: 1
covers:
  - symbol: useAppStore
    kind: function
    at: 'apps/platform/features/app/app-store.hooks.ts:L34-L64'
---

<!-- context:generated:start -->

## Summary

TanStack Router with Redux state synchronization via setupRouterSync and mapRoutePathToType utilities. Handles map shell vs. non-map shell differentiation, workspace history navigation, and hint persistence across route changes. Critical SSR constraint: syncInitialLocation must run in useMemo, not effects, to prevent hydration mismatches.

## Related

- produces [[analytics-tracking]] — Route type derived via mapRoutePathToType feeds analytics tracking context
- uses [[workspace-map-data]] — Router state drives map navigation and workspace selection; setupRouterSync bidirectionally syncs route params with Redux workspace state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
