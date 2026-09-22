---
name: Map Viewport and Bounds Fitting
slug: map-viewport-and-bounds-fitting
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/FitBounds.tsx
    hash: 57a7e5bb967bff0cb94c4e91f30ae102ed1dee075dc0cbbb456a3f7636b27b6d
sources_digest: 2c0bd5f569aca00736368b929fe4d251e083478edc7e4be162ad67b9b98173b3
links:
  - to: workspace-and-dataview-state-selectors
    relation: uses
    description: >-
      useTimebarUserPointsConnect and useTimerangeConnect manage timerange state
      updates triggered by FitBounds operations
generator:
  version: 1
covers:
  - symbol: FitBoundsProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/FitBounds.tsx:L25-L34'
  - symbol: useLayerFitBounds
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/FitBounds.tsx:L36-L191'
  - symbol: FitBounds
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/FitBounds.tsx:L193-L240'
---

<!-- context:generated:start -->

## Summary

Manages map view bounds and zoom level through useMapFitBounds hook and FitBounds component. When fitting bounds to data (vessel tracks, user points, polygons), automatically adjusts timerange if data falls outside current selection, prompting user confirmation. Queries layers for bounding boxes and validates timestamp overlap before updating global timerange.

## Related

- uses [[workspace-and-dataview-state-selectors]] — useTimebarUserPointsConnect and useTimerangeConnect manage timerange state updates triggered by FitBounds operations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
