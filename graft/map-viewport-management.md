---
name: Map Viewport Management
slug: map-viewport-management
type: system
sources:
  - path: apps/platform/features/_map/map/map-bounds.hooks.ts
    hash: 175735e0a1b095dd988cd0960537e0e02128ca13a977c14ba7e9c4ab07072b69
sources_digest: a9e085ba038c928bcda9d037961f671cbb3c1b4649504be0edd25fd628dd0a13
links:
  - to: map-context
    relation: depends_on
    description: Accesses the Deck.GL instance to unproject viewport corners and fit bounds
  - to: map-rendering-core
    relation: implements
    description: >-
      Provides the viewport state and setMapCoordinates callback used by
      DeckGLWrapper and controls
generator:
  version: 1
covers:
  - symbol: useMapBounds
    kind: function
    at: 'apps/platform/features/_map/map/map-bounds.hooks.ts:L18-L37'
  - symbol: useMapBoundsLive
    kind: function
    at: 'apps/platform/features/_map/map/map-bounds.hooks.ts:L39-L47'
  - symbol: FitBoundsParams
    kind: type
    at: 'apps/platform/features/_map/map/map-bounds.hooks.ts:L49-L57'
  - symbol: getMapCoordinatesFromBounds
    kind: function
    at: 'apps/platform/features/_map/map/map-bounds.hooks.ts:L59-L80'
  - symbol: useMapFitBounds
    kind: function
    at: 'apps/platform/features/_map/map/map-bounds.hooks.ts:L87-L117'
---

<!-- context:generated:start -->

## Summary

Manages map viewport state (coordinates, zoom, bounds) across deck.gl, Redux, and URL parameters. Provides hooks for reading/setting viewport, fitting to bounds with fly-to animations, and tracking live bounds on a debounced schedule. Accounts for layout elements (timebar, footer) when calculating dimensions.

## Related

- depends on [[map-context]] — Accesses the Deck.GL instance to unproject viewport corners and fit bounds
- implements [[map-rendering-core]] — Provides the viewport state and setMapCoordinates callback used by DeckGLWrapper and controls

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
