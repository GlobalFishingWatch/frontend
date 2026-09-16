---
name: Highlight Synchronization
slug: highlight-synchronization
type: system
sources:
  - path: apps/platform/features/_map/map/map-layers.sync.hooks.ts
    hash: fb96abfb61eafc0a08d184d623957d209865ef96e8d2291dfe22035562865711
sources_digest: a5b85313aa127fbd0bf8f820072f02379b65000bf133960620e84d96c5f111aa
links:
  - to: layer-composition-deck-integration
    relation: uses
    description: >-
      Consumes deckLayerInstancesAtom to access and update individual layer
      instances
  - to: map-view-state-management
    relation: depends_on
    description: Depends on viewStateAtom for viewport context
  - to: redux-state-slices
    relation: depends_on
    description: >-
      Reads highlight selectors from timebar, report-area, and track-correction
      Redux slices
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

Bridges Redux and Jotai highlight state (hovered/clicked features, time ranges, events) to individual deck-layer instances via imperative APIs. Uses per-layer hash tracking to avoid redundant calls when highlight values unchanged. Conditionally overrides timebar highlighting based on track-correction mode, with special handling for 'new' correction state.

## Related

- uses [[layer-composition-deck-integration]] — Consumes deckLayerInstancesAtom to access and update individual layer instances
- depends on [[map-view-state-management]] — Depends on viewStateAtom for viewport context
- depends on [[redux-state-slices]] — Reads highlight selectors from timebar, report-area, and track-correction Redux slices

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
