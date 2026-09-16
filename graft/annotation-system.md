---
name: Annotation System
slug: annotation-system
type: system
sources:
  - path: apps/platform/features/_map/map/overlays/annotations/annotations.hooks.ts
    hash: fc98a88897cdd7154f6db181e83ffbdf82c0bd6a937e6ba61cc9a0b7284fab2f
  - path: apps/platform/features/_map/map/overlays/annotations/Annotations.tsx
    hash: 4d1fc3826d1efcf0212b218aee8641565e9a2cd14ce0ef6eb3e0678c99bb3b2c
  - path: apps/platform/features/_map/map/overlays/annotations/annotations.types.ts
    hash: dccb2a238e3f2ca826f46bbe5ba2287dd708c846210e692e2ce1f7c95ef6cfa1
  - path: apps/platform/features/_map/map/overlays/annotations/AnnotationsDialog.tsx
    hash: bc496eb0e56cc7ab09c9948d569b733707cb45b25eb9d49331213a6879a9ed74
sources_digest: 2de5f81973f2c6d3775563e2e53d4a1bc776aa68306aa74b015c1d27b4352d9b
links:
  - to: map-popup-system
    relation: uses
    description: >-
      AnnotationsDialog uses PopupWrapper for coordinate-based dialog
      positioning
  - to: overlay-ui-state-management
    relation: uses
    description: >-
      Annotations integrate with overlaysCursorAtom for cursor feedback during
      drag operations
generator:
  version: 1
covers:
  - symbol: MapAnnotations
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/Annotations.tsx:L24-L143
  - symbol: MapAnnotationsDialog
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/AnnotationsDialog.tsx:L24-L91
  - symbol: onConfirmClick
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/AnnotationsDialog.tsx:L31-L42
  - symbol: onDeleteClick
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/AnnotationsDialog.tsx:L44-L47
  - symbol: useMapAnnotation
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/annotations.hooks.ts:L19-L60
  - symbol: useMapAnnotations
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/annotations/annotations.hooks.ts:L65-L119
  - symbol: MapAnnotation
    kind: type
    at: >-
      apps/platform/features/_map/map/overlays/annotations/annotations.types.ts:L1-L7
---

<!-- context:generated:start -->

## Summary

Manages creation, editing, and rendering of point-of-interest markers on a map. Separates draft annotations (transient in Redux MAP_CONTROL_ANNOTATIONS slice) from confirmed annotations (persisted in URL query parameters). Supports drag-and-drop repositioning with boundary validation (offset for sidebar/timebar), color customization, and label editing via popup dialog. Uses MapAnnotation type with required id/lon/lat/label fields and optional color.

## Related

- uses [[map-popup-system]] — AnnotationsDialog uses PopupWrapper for coordinate-based dialog positioning
- uses [[overlay-ui-state-management]] — Annotations integrate with overlaysCursorAtom for cursor feedback during drag operations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
