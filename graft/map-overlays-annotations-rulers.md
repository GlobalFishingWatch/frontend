---
name: Map Overlays (Annotations & Rulers)
slug: map-overlays-annotations-rulers
type: concept
sources:
  - path: apps/platform/features/_map/map/controls/AnnotationsControl.tsx
    hash: 013c89b552aade0409fa76dd782a8d019044e57d5d84b739bafb0fcd4cc8b252
  - path: apps/platform/features/_map/map/controls/RulersControl.tsx
    hash: 6642709bac55e1bde3cb430facaa32f08bca02de1a68f09da1b3fa4947cc6bf9
sources_digest: 0ea38e441dcd8aeb1e5dee8ee971ba90b27435cac910c21c7ee9485655a65cae
links:
  - to: map-controls-system
    relation: implements
    description: Provides UI controls for toggling annotation and ruler visibility/editing
  - to: map-interactions
    relation: depends_on
    description: >-
      Disables standard interaction handling when annotation or ruler editing is
      active
  - to: map-rendering-core
    relation: implements
    description: Renders MapAnnotations and ruler overlays on the map canvas
generator:
  version: 1
covers:
  - symbol: MapAnnotationsControls
    kind: function
    at: 'apps/platform/features/_map/map/controls/AnnotationsControl.tsx:L10-L46'
  - symbol: Rulers
    kind: function
    at: 'apps/platform/features/_map/map/controls/RulersControl.tsx:L7-L42'
---

<!-- context:generated:start -->

## Summary

Decoupled UI systems for map-based temporary annotations (point/polygon markups) and measurement rulers. Each maintains its own state (editing mode, collection), exposes toggle/visibility/delete operations via hooks, and renders via dedicated overlay components. Integrated into MapControls via separate control panels that manage visibility and editing modes.

## Related

- implements [[map-controls-system]] — Provides UI controls for toggling annotation and ruler visibility/editing
- depends on [[map-interactions]] — Disables standard interaction handling when annotation or ruler editing is active
- implements [[map-rendering-core]] — Renders MapAnnotations and ruler overlays on the map canvas

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
