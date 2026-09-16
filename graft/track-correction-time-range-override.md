---
name: Track-Correction Time Range Override
slug: track-correction-time-range-override
type: concept
sources:
  - path: apps/platform/features/_map/map/map-layers.sync.hooks.ts
    hash: fb96abfb61eafc0a08d184d623957d209865ef96e8d2291dfe22035562865711
sources_digest: a5b85313aa127fbd0bf8f820072f02379b65000bf133960620e84d96c5f111aa
links:
  - to: highlight-synchronization
    relation: part_of
    description: Track-correction override is implemented in highlight sync layer
generator:
  version: 1
covers:
  - symbol: SyncableLayer
    kind: type
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L29-L36'
  - symbol: LayerHighlightHashes
    kind: type
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L39-L39'
  - symbol: getFeaturePropertyId
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L43-L60'
  - symbol: getHoverFeaturesHash
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L62-L68'
  - symbol: getLayerHoverFeatures
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L70-L75'
  - symbol: getLayerHighlightedFeatures
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L77-L88'
  - symbol: toHighlightTimeMillis
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L90-L98'
  - symbol: useSyncMapHighlights
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.sync.hooks.ts:L100-L203'
---

<!-- context:generated:start -->

## Summary

When trackCorrectionId is set, highlight system conditionally overrides timebar time range with selectTrackCorrectionTimerange. Special handling for 'new' correction mode where editing active correction. Critical invariant: track-correction time must take precedence over timebar time when active, preventing user confusion between correction issue date and selected time range.

## Related

- part of [[highlight-synchronization]] — Track-correction override is implemented in highlight sync layer

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
