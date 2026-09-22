---
name: Map Layer and Viewport State Management
slug: map-layer-and-viewport-state-management
type: concept
sources:
  - path: apps/platform/test/integration/App.spec.tsx
    hash: 4884573763c4a4ad0b1fa9ca106717b725b4360f4d90c565d9d491bc9d1aaede
  - path: apps/platform/test/integration/Datasets.spec.tsx
    hash: 19c70c06d16b0684be0df33fd78c0a5067ce9cebbb6396e2efb81c85dd29358b
  - path: apps/platform/test/integration/Map.spec.tsx
    hash: 60e079056717bc93b3d925e3a6eccf6030407370416786354280209177e40ca4
  - path: apps/platform/test/integration/Timebar.spec.tsx
    hash: f5e0c9d1290d1155e6cd9563d3680aa645fd940a463b3dc471eadd3ef967a69d
sources_digest: cab9187e8a2b278a78ae34ea6d1c8249c6dcb429b73b05f61dd93ac30e5d115e
links:
  - to: redux-store-configuration
    relation: depends_on
    description: Location query state persists dataviewInstances and viewport configuration
generator:
  version: 1
covers:
  - symbol: getTileZoomLevels
    kind: function
    at: 'apps/platform/test/integration/Map.spec.tsx:L101-L109'
---

<!-- context:generated:start -->

## Summary

Coordinates viewport state (zoom, latitude, longitude) and layer composition through Jotai atoms (viewStateAtom, mapInstanceAtom, deckLayersStateAtom) and Redux location query slice. Layer visibility toggles dispatch location actions that persist dataviewInstances configuration. Viewport changes trigger map interactions through deck.gl.

## Related

- depends on [[redux-store-configuration]] — Location query state persists dataviewInstances and viewport configuration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
