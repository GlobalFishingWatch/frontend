---
name: Deck Layer Composition & Rendering
slug: deck-layer-composition-rendering
type: system
sources:
  - path: libs/deck-layer-composer/src/hooks/deck-layers-composer.hooks.ts
    hash: d1e11701381f134bf25f1bfed0d90b1854c68332bdaf0e538c7b2ff9db964ddf
  - path: libs/deck-layer-composer/src/resolvers/basemap.ts
    hash: b394d8e3d51d21d136e1b96990072b63d807c9a2098fb56151b233e94eebbd68
  - path: libs/deck-layer-composer/src/resolvers/bathymetry-contour.ts
    hash: 68674b9f2059e1905697c057ecc0690a5602fb622fec4cd25f63634af97d6dce
  - path: libs/deck-layer-composer/src/resolvers/clusters.ts
    hash: c25047d0a670f255f65b8fa76e653b7614f4ea809b15db81eb31653a275e447b
  - path: libs/deck-layer-composer/src/resolvers/context.ts
    hash: ee5c7de581ec1f970fbd8953b4de95f96136bfc7ff5832398d8ced30897acc8e
sources_digest: 7091424550cff24881e62dd55317fc3b33853a0320f9d620b275b03e83e63922
links:
  - to: dataview-resolution-filtering
    relation: uses
    description: >-
      Calls resolution functions to merge configs and compute filters for each
      layer
  - to: deck-layer-legends-interaction
    relation: produces
    description: Layer instances feed into legend generation and hover picking
  - to: deck-layer-resource-fetching
    relation: depends_on
    description: Waits for resource loading state before marking layers ready
generator:
  version: 1
covers:
  - symbol: ResolvedDeckLayer
    kind: type
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-composer.hooks.ts:L16-L20'
  - symbol: CachedDeckLayer
    kind: type
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-composer.hooks.ts:L21-L21'
  - symbol: useDeckLayerComposer
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-composer.hooks.ts:L23-L116'
  - symbol: useSetDeckLayerComposer
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-composer.hooks.ts:L118-L120'
  - symbol: resolvePMTilesUrl
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/basemap.ts:L18-L32'
  - symbol: resolvePMTilesDatasetTilesUrl
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/basemap.ts:L34-L40'
  - symbol: resolveDeckBasemapLabelsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/basemap.ts:L42-L53'
  - symbol: resolveDeckBasemapLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/basemap.ts:L55-L62'
  - symbol: resolveDeckBasemapImageLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/basemap.ts:L64-L75'
  - symbol: resolveDeckBathymetryContourLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/bathymetry-contour.ts:L11-L42'
  - symbol: getDateRangeQuery
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/clusters.ts:L18-L40'
  - symbol: resolveDeckFourwingsClustersLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/clusters.ts:L42-L103'
  - symbol: resolveDeckContextLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/context.ts:L14-L57'
---

<!-- context:generated:start -->

## Summary

Transforms dataview instances into instantiated deck.gl layers through a pipeline of resolution, sorting, and type-specific composition. Manages layer state (loading, ready), caches instances to avoid recreation, and optionally injects debug boundaries.

## Related

- uses [[dataview-resolution-filtering]] — Calls resolution functions to merge configs and compute filters for each layer
- produces [[deck-layer-legends-interaction]] — Layer instances feed into legend generation and hover picking
- depends on [[deck-layer-resource-fetching]] — Waits for resource loading state before marking layers ready

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
