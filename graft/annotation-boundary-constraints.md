---
name: Annotation Boundary Constraints
slug: annotation-boundary-constraints
type: concept
sources:
  - path: apps/platform/features/_map/map/overlays/annotations/Annotations.tsx
    hash: 4d1fc3826d1efcf0212b218aee8641565e9a2cd14ce0ef6eb3e0678c99bb3b2c
sources_digest: a99e5f21267edf6b29630794c8640dac894cad57b0ae2ffa875b69a0a2c3d020
links:
  - to: annotation-system
    relation: implements
    description: Boundary constraints ensure annotations stay in valid map area
generator:
  version: 1
covers:
  - symbol: MapAnnotations
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/Annotations.tsx:L24-L143
---

<!-- context:generated:start -->

## Summary

Drag-and-drop annotation repositioning enforced with magic-number offsets: xOffset=390px (sidebar width), yOffset=116px (timebar height). Prevents annotations being dragged into UI chrome. Critical invariant: coordinates must be validated via isValidLngLat and boundary-checked before persisting. TODO: offsets require manual maintenance if layout dimensions change—brittle dependency on UI chrome dimensions.

## Related

- implements [[annotation-system]] — Boundary constraints ensure annotations stay in valid map area

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
