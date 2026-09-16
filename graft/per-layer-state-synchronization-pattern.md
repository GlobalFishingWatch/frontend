---
name: Per-Layer State Synchronization Pattern
slug: per-layer-state-synchronization-pattern
type: concept
sources:
  - path: apps/platform/features/_map/map/map-layers.sync.hooks.ts
    hash: fb96abfb61eafc0a08d184d623957d209865ef96e8d2291dfe22035562865711
sources_digest: a5b85313aa127fbd0bf8f820072f02379b65000bf133960620e84d96c5f111aa
links:
  - to: highlight-synchronization
    relation: implements
    description: >-
      Per-layer hash tracking is the core optimization strategy in highlight
      sync
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

Design pattern where per-layer hash refs track feature, time, and event highlight values independently to avoid redundant imperative calls when state unchanged. Each layer maintains separate hashes for features/time/events, decoupling their update cycles. Hash comparison via useMemoCompare prevents calling setHighlightedFeatures, setHighlightedTime, setHighlightEventIds when values haven't changed. Enables efficient scaling to many layers without excessive function invocations.

## Related

- implements [[highlight-synchronization]] — Per-layer hash tracking is the core optimization strategy in highlight sync

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
