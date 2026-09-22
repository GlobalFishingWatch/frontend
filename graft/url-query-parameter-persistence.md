---
name: URL Query Parameter Persistence
slug: url-query-parameter-persistence
type: concept
sources:
  - path: apps/platform/features/_map/map/map-viewport.hooks.ts
    hash: 7d5a8821084f771059733fd0d24b2acc5b81c35bc54f48ffbcd294559c9cd955
  - path: apps/platform/features/_map/map/overlays/annotations/annotations.hooks.ts
    hash: fc98a88897cdd7154f6db181e83ffbdf82c0bd6a937e6ba61cc9a0b7284fab2f
  - path: apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts
    hash: f076fa01134fafda43e90ef30550d5c15c10211a7abd22530328c7b51e5ae4b6
sources_digest: 74c9ff5aae0542a259974e1fd9a89232585d58d4e592be332e52dc4ef422f33b
links:
  - to: map-view-state-management
    relation: uses
    description: Viewport synchronization uses URL params for deep-linking
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
  - symbol: useMapAnnotation
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/annotations.hooks.ts:L19-L60
  - symbol: useMapAnnotations
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/annotations.hooks.ts:L65-L119
  - symbol: useRulers
    kind: function
    at: 'apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts:L17-L130'
  - symbol: useMapRulerInstance
    kind: function
    at: 'apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts:L132-L143'
---

<!-- context:generated:start -->

## Summary

Map state (viewport, annotations, rulers, track-corrections, drawing mode) persists to URL query parameters via replaceQueryParams with debouncing (300ms for viewport, per-operation for others). Enables deep-linking and bookmarking of map state. URL params read on mount via getUrlViewstateNumericParam and synced back on state changes. Critical invariant: viewer state (annotations, rulers) must survive page reload via URL persistence.

## Related

- uses [[map-view-state-management]] — Viewport synchronization uses URL params for deep-linking

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
