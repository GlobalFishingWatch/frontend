---
name: Viewport State Atom
slug: viewport-state-atom
type: concept
sources:
  - path: apps/port-labeler/src/features/map/map-viewport.hooks.ts
    hash: a9a3d08174338efd14cb8551c7c656bc29dfa1ee79a019d8b364575dcca7049d
sources_digest: 76e1be65943279dc1dd4b628e870deda7400b406ade46531d82e768a04b980e0
links:
  - to: port-labeler-map-system
    relation: part_of
    description: useViewport hook provides viewport state and setMapCoordinates callback
generator:
  version: 1
covers:
  - symbol: ViewportKeys
    kind: type
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L8-L8'
  - symbol: ViewportProps
    kind: type
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L9-L9'
  - symbol: UseViewport
    kind: type
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L10-L14'
  - symbol: getUrlViewstateNumericParam
    kind: function
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L16-L20'
  - symbol: useViewport
    kind: function
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L28-L43'
---

<!-- context:generated:start -->

## Summary

Jotai atom managing map viewport coordinates (latitude, longitude, zoom) with URL parameter persistence. Initialized from search parameters via getUrlViewstateNumericParam with fallback to DEFAULT_VIEWPORT. Enables cross-component viewport sharing and URL-based map state recovery.

## Related

- part of [[port-labeler-map-system]] — useViewport hook provides viewport state and setMapCoordinates callback

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
