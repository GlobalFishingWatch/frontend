---
name: Map Layers
slug: map-layers
type: system
sources:
  - path: apps/platform/features/_map/map/map-layers.hooks.ts
    hash: 5fc3067318fe770349b731249200c9dba092a0903dd3864ca2609b5cd8c312bf
sources_digest: c8f8b08d9ba6b357fe40e14250a61f28a464b2a0d89c7a4f54d46ce85039d47e
links:
  - to: dataview-state-management
    relation: uses
    description: >-
      Reads workspace, buffer, and default dataview instances via Redux
      selectors
  - to: map-controls-system
    relation: depends_on
    description: >-
      Aggregates loading state (isDeckLayersLoading) used to disable controls
      during rendering
  - to: map-rendering-core
    relation: implements
    description: >-
      Provides useMapDataviewsLayers and overlay layers consumed by
      DeckGLWrapper and LayersComposer
generator:
  version: 1
covers:
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

Orchestrates composition of deck.gl visualization layers from Redux dataview state, applying global configuration (time range, visualization mode, debug settings), and handling max-points errors by switching to heatmap. Separates expensive layer composition from UI hover state via LayersComposer to optimize re-render performance. Merges dataview layers with overlay layers (draw, rulers, hotspots).

## Related

- uses [[dataview-state-management]] — Reads workspace, buffer, and default dataview instances via Redux selectors
- depends on [[map-controls-system]] — Aggregates loading state (isDeckLayersLoading) used to disable controls during rendering
- implements [[map-rendering-core]] — Provides useMapDataviewsLayers and overlay layers consumed by DeckGLWrapper and LayersComposer

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
