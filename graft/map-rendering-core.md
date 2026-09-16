---
name: Map Rendering Core
slug: map-rendering-core
type: system
sources:
  - path: apps/platform/features/_map/map/DeckGLWrapper.tsx
    hash: 3cf3035090278ee2ba1dcaa53c8ae80d30b8a11f1dc1f305aae88c993e105cbb
  - path: apps/platform/features/_map/map/drag-dataset.hooks.ts
    hash: 2bd2b7c3d0288cb27ad7efc103c924a59482663a234f8235bc0ddeae8ad1687d
  - path: apps/platform/features/_map/map/LayersComposer.tsx
    hash: f42905b80c4dbb6f7f8070b9fc3f4eab7b77f88ea70c9c63f98c069127daf08a
sources_digest: a6c1decb2837090ae35c07c43dd05e8f7195736d100e7791d3f4b5f741d7ad79
links:
  - to: map-context
    relation: uses
    description: >-
      Synchronizes the Deck.GL instance to mapInstanceAtom for cross-component
      access
  - to: map-interactions
    relation: uses
    description: 'Integrates click, hover, and drag event handlers via custom hooks'
  - to: map-layers
    relation: uses
    description: >-
      Composes dataview layers via LayersComposer, which uses
      useMapDataviewsLayers and useSyncMapHighlights
  - to: map-overlays-annotations-rulers
    relation: uses
    description: Renders MapAnnotations and TrackCorrectionsOverlay as child components
  - to: map-viewport-management
    relation: uses
    description: >-
      Synchronizes viewport state and calls setMapCoordinates for zoom/pan
      interactions
generator:
  version: 1
covers:
  - symbol: DeckGLWrapper
    kind: function
    at: 'apps/platform/features/_map/map/DeckGLWrapper.tsx:L36-L163'
  - symbol: LayersComposer
    kind: function
    at: 'apps/platform/features/_map/map/LayersComposer.tsx:L6-L10'
  - symbol: useDatasetDrag
    kind: function
    at: 'apps/platform/features/_map/map/drag-dataset.hooks.ts:L15-L121'
---

<!-- context:generated:start -->

## Summary

The core map visualization engine wrapping Deck.GL, integrating Redux state management, user interactions (click, hover, drag), custom overlays (annotations, track corrections), and dataset uploads. Manages viewport state synchronization, layer rendering via a sibling LayersComposer component, and disables interactions during Fourwings report tile loading.

## Related

- uses [[map-context]] — Synchronizes the Deck.GL instance to mapInstanceAtom for cross-component access
- uses [[map-interactions]] — Integrates click, hover, and drag event handlers via custom hooks
- uses [[map-layers]] — Composes dataview layers via LayersComposer, which uses useMapDataviewsLayers and useSyncMapHighlights
- uses [[map-overlays-annotations-rulers]] — Renders MapAnnotations and TrackCorrectionsOverlay as child components
- uses [[map-viewport-management]] — Synchronizes viewport state and calls setMapCoordinates for zoom/pan interactions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
