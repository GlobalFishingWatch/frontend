---
name: User Layer System
slug: user-layer-system
type: system
sources:
  - path: libs/deck-layers/src/layers/user/index.ts
    hash: 2280062f8d2ae94076a56d64987fa4153c0ae3d7c0d2e2bc3449087955819ea9
  - path: libs/deck-layers/src/layers/user/user.cache.ts
    hash: 3bb6e4b485bce5ac2597fdfd7df1aac8031d3de75d368893be17ba1a8ac64278
  - path: libs/deck-layers/src/layers/user/user.types.ts
    hash: 9f11d13a52e45fa6dc078c16b6804df082b11da72116582ff23e0d50d4b0c4f4
  - path: libs/deck-layers/src/layers/user/user.utils.ts
    hash: 1ccaa49cf38391905485bd0f3fd0785fae24487a069d16ff293dec71e01d6999
  - path: libs/deck-layers/src/layers/user/UserBaseLayer.ts
    hash: a7f512b76e078af7d86aa4bde23cba88d6cd2bc922ce07c1da4a6def2f05c381
  - path: libs/deck-layers/src/layers/user/UserPointsTileLayer.ts
    hash: ee18bd0303860e65d7e0fa70fb360d4a1d6cc60d533f23be85848b57d68dcf42
  - path: libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts
    hash: 68971f086786b011126e331d2221ca049e43d9ca953c32760e1753bafd40c041
  - path: libs/deck-layers/src/layers/user/UserTracksLayer.ts
    hash: ed96fee373ae05473d41b52d8636dfeff97d0c85d38518bcd6a8c58279ab2862
sources_digest: 297dd6bbb96a708aa7836a441e2177450033b4bd2e54f3fa2fedc510e854d287
links:
  - to: color-and-configuration-management
    relation: configures
    description: >-
      Applies color ramps, radius scaling, and step-based color visualization
      via d3-scale and internal configuration
  - to: deck-gl-layer-foundation
    relation: uses
    description: >-
      Extends CompositeLayer, TileLayer, GeoJsonLayer, ScatterplotLayer,
      PathLayer with deck.gl extensions (DataFilterExtension, ClipExtension,
      PathStyleExtension)
  - to: global-fishing-watch-api-integration
    relation: depends_on
    description: >-
      Fetches MVT tiles via GFWMVTLoader, queries bounds via GFWAPI, and uses
      UserTrackLoader for track geometry
  - to: response-caching-with-expiration
    relation: uses
    description: >-
      Uses user.cache module for 20-minute expiry, ArrayBuffer cloning to
      prevent mutation, and background cleanup intervals
  - to: temporal-filtering-architecture
    relation: implements
    description: >-
      Applies three-mode time filtering (dateRange, date modes) via
      _getTimeFilterProps and _getSublayerFilterExtensionProps with 30-minute
      precision offset workaround for float accuracy
generator:
  version: 1
covers:
  - symbol: _UserBaseLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L43-L44'
  - symbol: BoundsResponse
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L57-L61'
  - symbol: UserBaseLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L63-L65'
  - symbol: UserBaseLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L67-L67'
  - symbol: UserBaseLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L70-L456'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L77-L82'
  - symbol: getBbox
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L84-L137'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L139-L141'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L143-L148'
  - symbol: getRenderedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L204-L245'
  - symbol: _getTilesUrl
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L247-L275'
  - symbol: _getTimeFilterProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L277-L327'
  - symbol: _getSublayerFilterExtensionProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L329-L340'
  - symbol: _combineFilterExtensionProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L342-L418'
  - symbol: _getExtensionFilterProps
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserBaseLayer.ts:L420-L455'
  - symbol: _UserPointsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L41-L41'
  - symbol: GetUserPointsDataParams
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L53-L56'
  - symbol: UserPointsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L58-L62'
  - symbol: UserPointsTileLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L63-L374'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L70-L90'
  - symbol: filtersHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L92-L100'
  - symbol: aggregatedPropertyHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L102-L110'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L112-L115'
  - symbol: debounceTime
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L117-L119'
  - symbol: viewportLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L121-L123'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L130-L159'
  - symbol: getLayerInstance
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L210-L213'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L215-L217'
  - symbol: getColor
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L288-L290'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPointsTileLayer.ts:L299-L373'
  - symbol: _UserContextLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L40-L40'
  - symbol: UserPolygonsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L47-L51'
  - symbol: UserContextTileLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L53-L336'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L60-L72'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L74-L76'
  - symbol: filtersHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L78-L86'
  - symbol: aggregatedPropertyHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L88-L96'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L98-L101'
  - symbol: viewportLoaded
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L103-L105'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L107-L132'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts:L226-L335'
  - symbol: _UserTrackLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L53-L53'
  - symbol: UserTracksPathLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L90-L181'
  - symbol: getShaders
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L97-L136'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L138-L152'
  - symbol: draw
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L154-L180'
  - symbol: UserTrackContextLayer
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L183-L183'
  - symbol: UserTrackSublayer
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L184-L184'
  - symbol: RawDataIndex
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L186-L186'
  - symbol: UserTracksLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L187-L202'
  - symbol: UserTracksLayer
    kind: class
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L209-L601'
  - symbol: shouldUpdateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L220-L222'
  - symbol: updateState
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L224-L244'
  - symbol: _getLayerKey
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L246-L255'
  - symbol: _getDataKey
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L257-L261'
  - symbol: _getLodIndex
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L263-L268'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L270-L272'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L274-L279'
  - symbol: _getHighlightTimes
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L281-L286'
  - symbol: setHighlightedTime
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L288-L296'
  - symbol: _getFeatureIndex
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L444-L453'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L461-L463'
  - symbol: getData
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L465-L467'
  - symbol: getColor
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L469-L472'
  - symbol: getSegments
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L474-L485'
  - symbol: getBbox
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L487-L534'
  - symbol: addLine
    kind: function
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L501-L518'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/user/UserTracksLayer.ts:L556-L600'
  - symbol: AnyUserLayer
    kind: type
    at: 'libs/deck-layers/src/layers/user/index.ts:L11-L11'
  - symbol: ResponseCacheEntry
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L1-L4'
  - symbol: cloneArrayBuffer
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L6-L15'
  - symbol: generateCacheKey
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L20-L24'
  - symbol: isCacheValid
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L26-L28'
  - symbol: getCachedResponse
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L30-L36'
  - symbol: clearExpiredCache
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L38-L45'
  - symbol: clearCache
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L47-L49'
  - symbol: startCacheCleanup
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L53-L56'
  - symbol: stopCacheCleanup
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.cache.ts:L58-L63'
  - symbol: FilterExtensionProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L11-L15'
  - symbol: BaseUserLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L17-L31'
  - symbol: UserPolygonsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L33-L45'
  - symbol: UserPointsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L47-L71'
  - symbol: UserTrackLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L73-L86'
  - symbol: AnyUserLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L88-L88'
  - symbol: UserLayerFeature
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L90-L90'
  - symbol: UserLayerPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L92-L94'
  - symbol: UserLayerPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.types.ts:L96-L96'
  - symbol: IsFeatureInRangeParams
    kind: type
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L11-L17'
  - symbol: getFeatureTimeRange
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L19-L47'
  - symbol: isFeatureInRange
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L49-L66'
  - symbol: getFilterExtensionSize
    kind: function
    at: 'libs/deck-layers/src/layers/user/user.utils.ts:L68-L75'
---

<!-- context:generated:start -->

## Summary

Deck.gl layer suite for rendering user-generated geospatial data (polygons, points, tracks) with temporal filtering, spatial bounds queries, and interactive highlighting. Integrates with Global Fishing Watch API for tile-based data loading, manages response caching with automatic expiration, and applies GPU-accelerated filtering via DataFilterExtension and ClipExtension. Supports multi-sublayer configurations with filter logic and viewport-based data slicing.

## Related

- configures [[color-and-configuration-management]] — Applies color ramps, radius scaling, and step-based color visualization via d3-scale and internal configuration
- uses [[deck-gl-layer-foundation]] — Extends CompositeLayer, TileLayer, GeoJsonLayer, ScatterplotLayer, PathLayer with deck.gl extensions (DataFilterExtension, ClipExtension, PathStyleExtension)
- depends on [[global-fishing-watch-api-integration]] — Fetches MVT tiles via GFWMVTLoader, queries bounds via GFWAPI, and uses UserTrackLoader for track geometry
- uses [[response-caching-with-expiration]] — Uses user.cache module for 20-minute expiry, ArrayBuffer cloning to prevent mutation, and background cleanup intervals
- implements [[temporal-filtering-architecture]] — Applies three-mode time filtering (dateRange, date modes) via _getTimeFilterProps and _getSublayerFilterExtensionProps with 30-minute precision offset workaround for float accuracy

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
