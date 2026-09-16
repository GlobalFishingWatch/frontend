---
name: User Dataset Management
slug: user-dataset-management
type: system
sources:
  - path: apps/platform/test/integration/UserDatasets.spec.tsx
    hash: 048d78ad38e007ff7c0a9f19dab70d3ef9df76e4a569f05a44b8da2fdba1f2de
sources_digest: 8fddd72a93f0ca9a359b83f783d3fda4767617b2478880ceec4a6201deb9d422
links:
  - to: map-layer-and-viewport-state-management
    relation: depends_on
    description: User datasets render as dataview instances via map layers
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: 'Uses render(), makeStore(), mapInstanceAtom, and createTestingMiddleware'
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Allows authenticated users to upload, add, remove, and interact with custom datasets (tracks, polygons, points) on the map. Tests verify authentication gating, dataview configuration, map rendering, and cleanup flows. All tests currently skipped pending refinement of async handling and external service dependencies.

## Related

- depends on [[map-layer-and-viewport-state-management]] — User datasets render as dataview instances via map layers
- depends on [[test-infrastructure-and-utilities]] — Uses render(), makeStore(), mapInstanceAtom, and createTestingMiddleware

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
