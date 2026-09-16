---
name: Drawing & Coordinate System
slug: drawing-coordinate-system
type: system
sources:
  - path: apps/platform/features/_map/map/overlays/draw/CoordinateEditOverlay.tsx
    hash: 1964a00b9f205a2b0e275f86c7719d486bc9e9087b3ec0b36d05256b39d2e606
  - path: apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts
    hash: e4f715ba280b91765ea998d36f8bc38308b663a4e44b1119702c7c2ea04839d4
  - path: apps/platform/features/_map/map/overlays/draw/draw.hooks.ts
    hash: 4015b1971ef972a44f77dd17b1fb2ec9c9fe36e5dc5ba7451122de7e3981e361
  - path: apps/platform/features/_map/map/overlays/draw/draw.utils.ts
    hash: 9e0df2a20b44e2fbec3e1d3f745df98c12a061887b8fc6690ff847620cc77b8d
  - path: apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx
    hash: 60ac15257113d63b1ca390dcd0f1e6102c13e4db8f4b8bfcc5b1eefd42c32960
  - path: apps/platform/features/_map/map/overlays/draw/PendingDrawNotice.tsx
    hash: 7b3e7b4391ce02cc0e4d6cef940677bc4cb7f29116ebe0db6ff9b7b4a499319f
sources_digest: 9058e560fe25c4a29f5e70ff328b8889dc43667840b6c9f32385cfbad1ed6324
links:
  - to: map-popup-system
    relation: uses
    description: >-
      CoordinateEditOverlay and PendingDrawNotice use PopupWrapper for UI
      positioning
  - to: map-view-state-management
    relation: depends_on
    description: >-
      Drawing uses viewport for screen-to-world coordinate conversion and
      boundary validation
  - to: redux-state-slices
    relation: uses
    description: >-
      Integrates with datasets.hook and areas.slice for dataset creation and
      area validation
generator:
  version: 1
covers:
  - symbol: CoordinateEditOverlay
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/CoordinateEditOverlay.tsx:L15-L157
  - symbol: DrawFeature
    kind: type
    at: 'apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx:L39-L39'
  - symbol: MapDraw
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx:L42-L312'
  - symbol: PendingDrawNotice
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/PendingDrawNotice.tsx:L12-L34
  - symbol: PendingDrawGeometry
    kind: type
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L22-L22
  - symbol: usePendingDrawDataview
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L32-L42
  - symbol: usePendingDrawImportCenter
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L44-L56
  - symbol: usePendingDrawOverlayLayer
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L58-L102
  - symbol: useDrawLayerInstance
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/draw.hooks.ts:L11-L49'
  - symbol: getDrawDatasetDefinition
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/draw.utils.ts:L16-L37'
  - symbol: getFileWithFeatures
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/draw.utils.ts:L39-L63'
---

<!-- context:generated:start -->

## Summary

Enables users to draw custom geographic features (polygons/points) on the map and create datasets from them. Manages DrawLayer lifecycle via useDrawLayerInstance, provides fine-grained coordinate editing via CoordinateEditOverlay popup, validates geometries (minimum polygon vertices, no overlaps), and persists drawn features to backend via datasets API. Maintains pending-draw visual preview until import completes, auto-clearing when dataset status='done'. Coordinate editing validates bounds (lat [-90,90], lng [-180,180]) and prevents deletion of polygon closure vertex.

## Related

- uses [[map-popup-system]] — CoordinateEditOverlay and PendingDrawNotice use PopupWrapper for UI positioning
- depends on [[map-view-state-management]] — Drawing uses viewport for screen-to-world coordinate conversion and boundary validation
- uses [[redux-state-slices]] — Integrates with datasets.hook and areas.slice for dataset creation and area validation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
