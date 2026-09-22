---
name: Dual Data-Sourcing Strategy
slug: dual-data-sourcing-strategy
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/polygons.ts
    hash: 90175fcf5ffc48509ed3d49f51d9b02ee72f2c5def1a526a2892c843e3e23855
sources_digest: b198327c29e9a855a10a2bdba3c06471a242c9ff787aab53e8bacbe4efd7253c
links: []
generator:
  version: 1
covers:
  - symbol: resolvePolygonsDataUrl
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/polygons.ts:L12-L28'
  - symbol: resolveDeckPolygonsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/polygons.ts:L30-L49'
---

<!-- context:generated:start -->

## Summary

Polygon resolver prioritizes static GeoJSON data inline from dataview.config.data over dynamic URL endpoints, allowing flexibility between pre-loaded and API-fetched geometries.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
