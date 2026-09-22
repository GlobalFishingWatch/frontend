---
name: SSR Hydration Strategy
slug: ssr-hydration-strategy
type: concept
sources:
  - path: apps/platform/features/_map/map/map-viewport.hooks.ts
    hash: 7d5a8821084f771059733fd0d24b2acc5b81c35bc54f48ffbcd294559c9cd955
  - path: apps/platform/features/_map/map/map.atoms.ts
    hash: a300fdd4f23e88076f035ace6f7307288a077958ea8a2b6848301eb8ce145977
sources_digest: 782dd215fdf56b14fdd12f0d4c2de4e64fc486577f9bcb7e7ffac190495afb07
links:
  - to: map-view-state-management
    relation: implements
    description: >-
      SSR hydration strategy is foundational to atom initialization and URL sync
      timing
generator:
  version: 1
covers:
  - symbol: useMapViewState
    kind: function
    at: 'apps/platform/features/_map/map/map-viewport.hooks.ts:L16-L18'
  - symbol: useMapViewStateUrlSync
    kind: function
    at: 'apps/platform/features/_map/map/map-viewport.hooks.ts:L23-L37'
  - symbol: useUpdateViewStateUrlParams
    kind: function
    at: 'apps/platform/features/_map/map/map-viewport.hooks.ts:L44-L66'
  - symbol: getMapViewport
    kind: function
    at: 'apps/platform/features/_map/map/map-viewport.hooks.ts:L78-L86'
  - symbol: useMapViewport
    kind: function
    at: 'apps/platform/features/_map/map/map-viewport.hooks.ts:L88-L91'
  - symbol: BoundsAtom
    kind: type
    at: 'apps/platform/features/_map/map/map.atoms.ts:L10-L10'
---

<!-- context:generated:start -->

## Summary

Atom initialization uses deterministic DEFAULT_VIEWPORT values to prevent server-render / client-render mismatches. URL-based viewport synchronization deferred to client via useMapViewStateUrlSync hook with useIsomorphicLayoutEffect, running only after hydration completes (when getIsBrowser() returns true). Critical invariant: URL sync must not execute on server to avoid SSR mismatch errors.

## Related

- implements [[map-view-state-management]] — SSR hydration strategy is foundational to atom initialization and URL sync timing

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
