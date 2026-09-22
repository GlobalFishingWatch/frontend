---
name: Context Areas Management System
slug: context-areas-management-system
type: system
sources:
  - path: apps/platform/features/_map/workspace/context-areas/context.utils.ts
    hash: 008396946f42f1782e6289cf7b0055c55649a083df6dbf6d219c08cad0c51116
  - path: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx
    hash: bd1d7e8ef34cca37c2f79ed50cf22e860ab68b8ef0ec692efbba88045741ac76
  - path: apps/platform/features/_map/workspace/context-areas/ContextAreaSection.tsx
    hash: fe1c3fabae0687c4b11d0b19763e4f60a1e410eb435a312f6f8334c52002d792
sources_digest: d74cce565726e2d3b02805015b61441b6eb9b258ab098df1efd65082dc8cd5cc
links:
  - to: deckgl-layer-integration
    relation: uses
    description: >-
      useGetDeckLayer accesses rendered context area layer to extract features
      visible in viewport and compute distances
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Reads selectContextAreasDataviewsGrouped and selectReadOnly for context
      dataview state and permission checks
generator:
  version: 1
covers:
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L61-L65
  - symbol: FeaturesOnScreen
    kind: type
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L72-L72
  - symbol: LayerPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L73-L426
  - symbol: updateFeaturesOnScreen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L111-L122
  - symbol: changeColor
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L151-L160
  - symbol: changeThickness
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L161-L169
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L170-L172
  - symbol: onToggleFilterOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L174-L176
  - symbol: closeExpandedContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L182-L185
  - symbol: highlightArea
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaLayerPanel.tsx:L220-L222
  - symbol: ContextAreaSection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/ContextAreaSection.tsx:L25-L113
  - symbol: FilterFeaturesByCenterDistanceParams
    kind: type
    at: >-
      apps/platform/features/_map/workspace/context-areas/context.utils.ts:L23-L26
  - symbol: filterFeaturesByDistance
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/context.utils.ts:L27-L43
  - symbol: parseContextFeatures
    kind: function
    at: >-
      apps/platform/features/_map/workspace/context-areas/context.utils.ts:L45-L60
---

<!-- context:generated:start -->

## Summary

Manages geographic reference layers (EEZ, MPA, protected areas, basemap labels) in the map workspace. ContextAreaSection renders a sortable list of context dataviews via ContextAreaLayerPanel, which manages visibility/color/thickness properties and optional filters. context.utils provides feature filtering and normalization: filterFeaturesByDistance ranks GeoJSON features by proximity and limits to N closest; parseContextFeatures extracts dataset-specific gfw_id properties and normalizes for map rendering. Notable design: basemap label layers hide color/thickness properties; features list is debounced to prevent UI flicker. DATAVIEWS_WARNING constant lists critical dataview IDs (EEZ, MPA, protected seas, basemap) that likely trigger validation elsewhere.

## Related

- uses [[deckgl-layer-integration]] — useGetDeckLayer accesses rendered context area layer to extract features visible in viewport and compute distances
- depends on [[workspace-redux-state]] — Reads selectContextAreasDataviewsGrouped and selectReadOnly for context dataview state and permission checks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
