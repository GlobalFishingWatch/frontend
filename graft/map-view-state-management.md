---
name: Map View State Management
slug: map-view-state-management
type: system
sources:
  - path: apps/platform/features/_map/map/map-view-state.hooks.ts
    hash: d1dea139e33c00f17c89ff2c412bbfb0a82d666e67c3d81844b3cb8823eb5165
  - path: apps/platform/features/_map/map/map-viewport.hooks.ts
    hash: 7d5a8821084f771059733fd0d24b2acc5b81c35bc54f48ffbcd294559c9cd955
  - path: apps/platform/features/_map/map/map.atoms.ts
    hash: a300fdd4f23e88076f035ace6f7307288a077958ea8a2b6848301eb8ce145977
sources_digest: 72bccebd1968da7c9054914fe1a6056ba1affa113cb8d91663cf2f02b3eb91c7
links:
  - to: drawing-coordinate-system
    relation: uses
    description: >-
      Drawing system relies on viewport projection for coordinate validation and
      boundary offsets
  - to: highlight-synchronization
    relation: depends_on
    description: >-
      Highlight system depends on viewStateAtom to determine which features are
      in viewport for selective highlighting
  - to: map-configuration-constants
    relation: depends_on
    description: >-
      Reads MAP_VIEW instance, container IDs, and DEFAULT_VIEWPORT from
      map.config and platform config
generator:
  version: 1
covers:
  - symbol: getSafeViewState
    kind: function
    at: 'apps/platform/features/_map/map/map-view-state.hooks.ts:L9-L28'
  - symbol: useMapSetViewState
    kind: function
    at: 'apps/platform/features/_map/map/map-view-state.hooks.ts:L30-L39'
  - symbol: useSetMapCoordinates
    kind: function
    at: 'apps/platform/features/_map/map/map-view-state.hooks.ts:L43-L60'
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

Coordinates camera position, Web Mercator bounds validation, and viewport synchronization across Jotai atoms, URL parameters, and deck.gl. Enforces latitude constraints (±85.051129°) to prevent projection singularities, throttles updates at 1ms intervals to avoid excessive re-renders, and uses dual-update pattern (Jotai + deck.setProps) to maintain synchronization across the library.

## Related

- uses [[drawing-coordinate-system]] — Drawing system relies on viewport projection for coordinate validation and boundary offsets
- depends on [[highlight-synchronization]] — Highlight system depends on viewStateAtom to determine which features are in viewport for selective highlighting
- depends on [[map-configuration-constants]] — Reads MAP_VIEW instance, container IDs, and DEFAULT_VIEWPORT from map.config and platform config

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
