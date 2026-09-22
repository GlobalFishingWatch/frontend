---
name: Response Caching with Expiration
slug: response-caching-with-expiration
type: concept
sources:
  - path: libs/deck-layers/src/layers/user/user.cache.ts
    hash: 3bb6e4b485bce5ac2597fdfd7df1aac8031d3de75d368893be17ba1a8ac64278
  - path: libs/deck-layers/src/layers/user/UserTracksLayer.ts
    hash: ed96fee373ae05473d41b52d8636dfeff97d0c85d38518bcd6a8c58279ab2862
sources_digest: 7e17a1b146ac6cd1536cff33661f4cc16998d93fddd558c49e9191c6f64a8dc0
links: []
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

In-memory ArrayBuffer response caching with 20-minute TTL for tile and track data, keyed by normalized URLs (filter parameters stripped). Implements resilient cloneArrayBuffer fallback for detached buffers in cross-realm scenarios. Background cleanup interval removes stale entries; must be explicitly started/stopped via lifecycle functions. Cache prevents redundant API calls and ensures mutable data independence across layer instances.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
