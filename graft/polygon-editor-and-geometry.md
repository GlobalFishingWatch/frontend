---
name: Polygon Editor and Geometry
slug: polygon-editor-and-geometry
type: system
sources:
  - path: apps/platform/test/integration/Polygon.spec.tsx
    hash: 4fd92bc36ccd8e8da4d4a7888d482e0ad97076222e9c68499cfe9c0aaf5dc4a9
sources_digest: 29e421e1c5a80db3ee83c53d29db8fe9edb5a8fd96c1e89c276cc5f053a3e9c3
links:
  - to: map-layer-and-viewport-state-management
    relation: depends_on
    description: Polygons load through deck layers and use viewport projection for drawing
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: 'Uses render(), makeStore(), Jotai atoms, and polling for async operations'
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Enables users to draw, save, and delete polygon geometries on the map with timestamp-based ID generation. Tests verify polygon layer loading through deckLayersStateAtom, end-to-end drawing workflows with screen-space coordinate projection, and deletion from the datasets view. Mocks Date.now() for consistent test IDs.

## Related

- depends on [[map-layer-and-viewport-state-management]] — Polygons load through deck layers and use viewport projection for drawing
- depends on [[test-infrastructure-and-utilities]] — Uses render(), makeStore(), Jotai atoms, and polling for async operations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
