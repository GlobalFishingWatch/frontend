---
name: Layer Panel Container and Layout Components
slug: layer-panel-container-and-layout-components
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/ExpandedContainer.tsx
    hash: 5f0abab78abf01a9474cb716735bf7ccf490b5e827918018f46b057ee31ebc23
  - path: apps/platform/features/_map/workspace/shared/layer-panel-sort.hook.ts
    hash: 7d7a209211b9e8a50a3297b4cbc2458750fb6d2066c428f906965cb99006c597
  - path: apps/platform/features/_map/workspace/shared/LayerPanelContainer.tsx
    hash: 532b85c442590d2a8745d7dc73b857dcfec138aee6fcdb29362ed71b8bd3d093
sources_digest: 4073e9a0e0151d8c6ec3825096496ee8821004c824742b6f2eca04d00605d79b
links:
  - to: layer-filter-and-properties-components
    relation: uses
    description: >-
      LayerProperties and filter panels use ExpandedContainer to render floating
      popovers; ExpandedContainer constrains overflow within
      SCROLL_CONTAINER_DOM_ID
generator:
  version: 1
covers:
  - symbol: ExpandedContainerProps
    kind: interface
    at: 'apps/platform/features/_map/workspace/shared/ExpandedContainer.tsx:L25-L36'
  - symbol: ExpandedContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/ExpandedContainer.tsx:L38-L139
  - symbol: fn
    kind: method
    at: 'apps/platform/features/_map/workspace/shared/ExpandedContainer.tsx:L55-L70'
  - symbol: apply
    kind: method
    at: >-
      apps/platform/features/_map/workspace/shared/ExpandedContainer.tsx:L96-L102
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/LayerPanelContainer.tsx:L7-L10
  - symbol: LayerPanelContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerPanelContainer.tsx:L12-L19
  - symbol: useLayerPanelDataviewSort
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/layer-panel-sort.hook.ts:L4-L20
---

<!-- context:generated:start -->

## Summary

Provides container and layout abstractions for layer panel UI, including ExpandedContainer for floating popovers with intelligent positioning/overflow handling, LayerPanelContainer that standardizes highlight panel placement, and layer-panel-sort hook for drag-and-drop reordering with visual feedback. Manages z-index layering and CSS transitions for smooth animations.

## Related

- uses [[layer-filter-and-properties-components]] — LayerProperties and filter panels use ExpandedContainer to render floating popovers; ExpandedContainer constrains overflow within SCROLL_CONTAINER_DOM_ID

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
