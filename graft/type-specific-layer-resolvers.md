---
name: Type-Specific Layer Resolvers
slug: type-specific-layer-resolvers
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/basemap.ts
    hash: b394d8e3d51d21d136e1b96990072b63d807c9a2098fb56151b233e94eebbd68
  - path: libs/deck-layer-composer/src/resolvers/context.ts
    hash: ee5c7de581ec1f970fbd8953b4de95f96136bfc7ff5832398d8ced30897acc8e
  - path: libs/deck-layer-composer/src/resolvers/fourwings.ts
    hash: b951f7b683df8a07f4ac314ab028ab68e0bdb56003a861924155d47ba3aa275b
  - path: libs/deck-layer-composer/src/resolvers/graticules.ts
    hash: 2dc22efc07e2278b35551fcf854b40653485c08c57c3680d16d641072e59a5ab
  - path: libs/deck-layer-composer/src/resolvers/polygons.ts
    hash: 90175fcf5ffc48509ed3d49f51d9b02ee72f2c5def1a526a2892c843e3e23855
  - path: libs/deck-layer-composer/src/resolvers/user.ts
    hash: 28250fb08d0ab593f34d5b72fd1fbb1dd6a569efba3b7cb169cf672271d7250f
  - path: libs/deck-layer-composer/src/resolvers/vectors.ts
    hash: 95d2380d06bf8cb614d482a89f87d6b75c8e3930b50db81c714b1042c4687382
  - path: libs/deck-layer-composer/src/resolvers/vessels.ts
    hash: ec5ac48a92ff51388ce4aaa9c8380d939f917c4e735eb7676b7782c5f81b32ed
  - path: libs/deck-layer-composer/src/resolvers/workspaces.ts
    hash: aa9336efbe84288a27b9a5f508079361eaea84be2a03e5c92fb4f22ef1e083c3
sources_digest: 30f4518b9659804e9d9796ece8e3698a882d1db8dabb994189a4a93fd516e528
links:
  - to: api-gateway-integration
    relation: uses
    description: >-
      Vessel and user resolvers fetch API endpoints from
      @globalfishingwatch/api-client for realtime or historical data
  - to: dataset-client
    relation: depends_on
    description: >-
      All resolvers use datasets-client for endpoint resolution, dataset
      introspection, and configuration lookup
  - to: deck-layers-library
    relation: produces
    description: >-
      Each resolver produces layer-specific props objects compatible with
      deck-layers types
  - to: fourwings-sublayer-extraction
    relation: uses
    description: >-
      resolveDeckFourwingsLayerProps delegates to getFourwingsDataviewSublayers
      for sublayer configuration
  - to: temporal-metadata-extraction
    relation: uses
    description: >-
      Multiple resolvers import getDataviewAvailableIntervals to determine
      supported time intervals
generator:
  version: 1
covers:
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
  - symbol: resolveDeckContextLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/context.ts:L14-L57'
  - symbol: resolveDeckFourwingsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/fourwings.ts:L36-L208'
  - symbol: resolveDeckGraticulesLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/graticules.ts:L5-L14'
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
  - symbol: resolveDeckVectorsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vectors.ts:L14-L84'
  - symbol: resolveDeckVesselLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vessels.ts:L14-L98'
  - symbol: resolveDeckWorkspacesLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/workspaces.ts:L5-L14'
---

<!-- context:generated:start -->

## Summary

Specialized resolver functions that convert dataview instances into props for specific deck.gl layer types, handling data aggregation, endpoint construction, and visual styling across eight layer categories.

## Related

- uses [[api-gateway-integration]] — Vessel and user resolvers fetch API endpoints from @globalfishingwatch/api-client for realtime or historical data
- depends on [[dataset-client]] — All resolvers use datasets-client for endpoint resolution, dataset introspection, and configuration lookup
- produces [[deck-layers-library]] — Each resolver produces layer-specific props objects compatible with deck-layers types
- uses [[fourwings-sublayer-extraction]] — resolveDeckFourwingsLayerProps delegates to getFourwingsDataviewSublayers for sublayer configuration
- uses [[temporal-metadata-extraction]] — Multiple resolvers import getDataviewAvailableIntervals to determine supported time intervals

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
