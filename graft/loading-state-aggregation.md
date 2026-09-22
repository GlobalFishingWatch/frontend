---
name: Loading State Aggregation
slug: loading-state-aggregation
type: concept
sources:
  - path: apps/platform/features/_map/map/controls/MapControls.tsx
    hash: 35b7fd683e627f93cd5a9c398cc3532d733bc18538e4fe74766d224dbcae0b7a
  - path: apps/platform/features/_map/map/map-layers.hooks.ts
    hash: 5fc3067318fe770349b731249200c9dba092a0903dd3864ca2609b5cd8c312bf
sources_digest: 59e1d429535e69e9ba9b4bd047ad5947a5a6f6c10d4e29e32dc49b4a6f4dae91
links:
  - to: map-controls-system
    relation: configures
    description: Disables controls when map is loading data or rendering layers
generator:
  version: 1
covers:
  - symbol: MapControls
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapControls.tsx:L48-L220'
  - symbol: useActivityDataviewId
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L69-L82'
  - symbol: useGlobalConfigConnect
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L84-L182'
  - symbol: useMapDataviewsLayers
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L184-L224'
  - symbol: useHotspotOverlayLayer
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L226-L244'
  - symbol: useMapOverlayLayers
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L246-L256'
  - symbol: useMapLayers
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L258-L264'
---

<!-- context:generated:start -->

## Summary

Pattern combining multiple async operation status indicators (isDeckLayersLoading, selectReportAreaStatus) into a single disabled state for map controls. Prevents user interactions during rendering or data fetching, ensuring map stability during expensive operations.

## Related

- configures [[map-controls-system]] — Disables controls when map is loading data or rendering layers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
