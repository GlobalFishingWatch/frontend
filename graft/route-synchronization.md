---
name: Route Synchronization
slug: route-synchronization
type: system
sources:
  - path: apps/platform/router/router-sync.ts
    hash: 823a3f0a4879a97be62a2984a813606a37932c82a8a54769b9ea1ca6f64330c5
sources_digest: a1983f17e533e1be4a224bd7df39f1034950f1dccbead19b6b231cce56f8ca32
links:
  - to: location-state
    relation: produces
    description: >-
      Dispatches setLocation action to update Redux state.location and workspace
      history
  - to: route-configuration
    relation: depends_on
    description: >-
      Uses route type mappings (ROUTE_PATHS, mapRoutePathToType) to normalize
      route information
  - to: router-core
    relation: uses
    description: >-
      Subscribes to TanStack Router events and accesses current location via
      router.latestLocation
generator:
  version: 1
covers:
  - symbol: NavigationState
    kind: interface
    at: 'apps/platform/router/router-sync.ts:L15-L17'
  - symbol: toRoutePathValue
    kind: function
    at: 'apps/platform/router/router-sync.ts:L27-L29'
  - symbol: syncInitialLocation
    kind: function
    at: 'apps/platform/router/router-sync.ts:L41-L59'
  - symbol: setupRouterSync
    kind: function
    at: 'apps/platform/router/router-sync.ts:L74-L207'
---

<!-- context:generated:start -->

## Summary

Bidirectional synchronization layer between TanStack Router state and Redux store, ensuring URL changes are reflected in state.location and maintaining workspace history for back-button tracking. Performs SSR-safe synchronous initialization via syncInitialLocation to prevent hydration mismatches, then sets up router event subscribers that deduplicate rapid navigations and sync state before route render (onBeforeNavigate) and after browser history commits (onResolved).

## Related

- produces [[location-state]] — Dispatches setLocation action to update Redux state.location and workspace history
- depends on [[route-configuration]] — Uses route type mappings (ROUTE_PATHS, mapRoutePathToType) to normalize route information
- uses [[router-core]] — Subscribes to TanStack Router events and accesses current location via router.latestLocation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
