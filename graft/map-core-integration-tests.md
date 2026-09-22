---
name: Map Core Integration Tests
slug: map-core-integration-tests
type: system
sources:
  - path: apps/platform/test/integration/Map.spec.tsx
    hash: 60e079056717bc93b3d925e3a6eccf6030407370416786354280209177e40ca4
sources_digest: 97e3ebe807740c0375ddd3c9c302d8ebabc07c44268875cf3ec8cb9d25fe00a8
links:
  - to: map-layer-and-viewport-state-management
    relation: validates
    description: 'Verifies viewport state synchronization between atoms, Redux, and URL'
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: 'Uses test utilities, fixtures, and middleware for state inspection'
generator:
  version: 1
covers:
  - symbol: getTileZoomLevels
    kind: function
    at: 'apps/platform/test/integration/Map.spec.tsx:L101-L109'
---

<!-- context:generated:start -->

## Summary

Verifies rendering, viewport management, layer operations, zoom interactions, time-range updates, and GFWAPI data fetching. Tests verify state changes propagate between URL query parameters, Jotai atoms, and Redux store with debounce respect and coordinate projection for hover/click interactions.

## Related

- validates [[map-layer-and-viewport-state-management]] — Verifies viewport state synchronization between atoms, Redux, and URL
- depends on [[test-infrastructure-and-utilities]] — Uses test utilities, fixtures, and middleware for state inspection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
