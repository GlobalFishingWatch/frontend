---
name: Environmental Layer Management System
slug: environmental-layer-management-system
type: system
sources:
  - path: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx
    hash: c5641be04de3f6fd6e00a96bec3720f7ac67606951e79e50d0b316802b2cdb50
  - path: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalSection.tsx
    hash: 15029a77f6a06703e6d2f65bc72eb204606d55e795b0ecdcb4cfa7fd09535a39
  - path: apps/platform/features/_map/workspace/environmental/histogram.hooks.ts
    hash: 90c727767ef6e41e6becdbff6755a893b6ee4e01a42f53a868a23d0a41bdd7bb
  - path: >-
      apps/platform/features/_map/workspace/environmental/HistogramRangeFilter.tsx
    hash: 335db700ff5d9b33937494a1c4d791c5cb8bc0e4374e0ddd78512002aa2656e2
sources_digest: 55de128ffd0bffe885318194ce8fdb53d628881e752ac07c00fa84f05f2c715a
links:
  - to: deckgl-layer-integration
    relation: uses
    description: >-
      useDataviewHistogram calls useGetDeckLayer to access FourwingsLayer
      features and compute histogram from viewport data
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Reads selectEnvironmentalDataviews, user permissions, and visualization
      mode state via Redux selectors
generator:
  version: 1
covers:
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L42-L45
  - symbol: EnvironmentalLayerPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L47-L309
  - symbol: changeColor
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L108-L116
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L117-L119
  - symbol: closeExpandedContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L121-L124
  - symbol: onToggleFilterOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L126-L134
  - symbol: EnvironmentalLayerSection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalSection.tsx:L37-L159
  - symbol: HistogramRangeFilterProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/environmental/HistogramRangeFilter.tsx:L18-L24
  - symbol: HistogramRangeFilter
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/HistogramRangeFilter.tsx:L26-L81
  - symbol: useDataviewHistogram
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/histogram.hooks.ts:L18-L63
---

<!-- context:generated:start -->

## Summary

Manages environmental data layers (bathymetry, contours, heatmaps, PMTiles) in the map workspace. EnvironmentalSection orchestrates layer visibility and visualization mode switching, while EnvironmentalLayerPanel manages individual layer controls: filters (schema-based fields like type, flag, speed), color ramp selection with multi-hue animated heatmap support, and legend visualization. histogram.hooks exports useDataviewHistogram, which computes viewport-constrained value distributions (50 bins) by filtering FourwingsLayer features and applying d3 binning. HistogramRangeFilter provides interactive dual-range slider UI for min/max filtering with Recharts histogram visualization. useDataviewHistogram debounces map bounds at 1000ms to avoid expensive updates during panning.

## Related

- uses [[deckgl-layer-integration]] — useDataviewHistogram calls useGetDeckLayer to access FourwingsLayer features and compute histogram from viewport data
- depends on [[workspace-redux-state]] — Reads selectEnvironmentalDataviews, user permissions, and visualization mode state via Redux selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
