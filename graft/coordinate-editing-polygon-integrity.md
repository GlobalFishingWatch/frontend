---
name: Coordinate Editing Polygon Integrity
slug: coordinate-editing-polygon-integrity
type: concept
sources:
  - path: apps/platform/features/_map/map/overlays/draw/CoordinateEditOverlay.tsx
    hash: 1964a00b9f205a2b0e275f86c7719d486bc9e9087b3ec0b36d05256b39d2e606
sources_digest: d7f117c27b2f39d7ec2aab7aed45ebe3da55c32b6ef66a87169a70a00c3f1b08
links:
  - to: drawing-coordinate-system
    relation: implements
    description: Polygon integrity constraints prevent invalid geometry states
generator:
  version: 1
covers:
  - symbol: CoordinateEditOverlay
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/CoordinateEditOverlay.tsx:L15-L157
---

<!-- context:generated:start -->

## Summary

Polygon coordinate editing prevents deletion of closure vertex (4th coordinate that duplicates 1st) to maintain polygon validity. Validates latitude [-90,90] and longitude [-180,180] bounds on each edit. Critical invariant: polygon must always have minimum 4 coordinates (forming closed loop), and deletion logic must never allow fewer. Attempted deletion of closure vertex triggers validation error rather than silent failure.

## Related

- implements [[drawing-coordinate-system]] — Polygon integrity constraints prevent invalid geometry states

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
