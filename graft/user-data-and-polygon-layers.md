---
name: User Data and Polygon Layers
slug: user-data-and-polygon-layers
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/polygons.ts
    hash: 90175fcf5ffc48509ed3d49f51d9b02ee72f2c5def1a526a2892c843e3e23855
  - path: libs/deck-layer-composer/src/resolvers/user.ts
    hash: 28250fb08d0ab593f34d5b72fd1fbb1dd6a569efba3b7cb169cf672271d7250f
  - path: libs/deck-layer-composer/src/resolvers/workspaces.ts
    hash: aa9336efbe84288a27b9a5f508079361eaea84be2a03e5c92fb4f22ef1e083c3
sources_digest: 84ddc3df0d743a4607d49285bf0d2cb35ad40d2d542f491dbd5b3555bf6edde7
links:
  - to: dataset-client
    relation: uses
    description: >-
      Uses findDatasetByType and dataset configuration properties for geometry
      and styling lookup
  - to: temporal-metadata-extraction
    relation: uses
    description: Extracts temporal bounds for user context polygon URLs when available
generator:
  version: 1
covers:
  - symbol: resolvePolygonsDataUrl
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/polygons.ts:L12-L28'
  - symbol: resolveDeckPolygonsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/polygons.ts:L30-L49'
  - symbol: getUserContextTimeFilterProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L24-L59'
  - symbol: getUserPolygonColorProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L61-L82'
  - symbol: getUserCircleProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L84-L130'
  - symbol: resolveDeckUserLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L132-L226'
  - symbol: resolveDeckUserContextLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L228-L238'
  - symbol: resolveDeckUserPointsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L240-L251'
  - symbol: resolveDeckUserTracksLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L253-L264'
  - symbol: resolveDeckWorkspacesLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/workspaces.ts:L5-L14'
---

<!-- context:generated:start -->

## Summary

Renders user-drawn geometries (polygons, points, tracks) and context polygon overlays with dynamic styling, time filtering, and support for both static GeoJSON and API-fetched data.

## Related

- uses [[dataset-client]] — Uses findDatasetByType and dataset configuration properties for geometry and styling lookup
- uses [[temporal-metadata-extraction]] — Extracts temporal bounds for user context polygon URLs when available

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
