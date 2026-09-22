---
name: Timebar State Synchronization
slug: timebar-state-synchronization
type: concept
sources:
  - path: apps/platform/test/integration/Timebar.spec.tsx
    hash: f5e0c9d1290d1155e6cd9563d3680aa645fd940a463b3dc471eadd3ef967a69d
sources_digest: ceee1288c22d1854ac5cff51f25e30d84c6388915c10c611fdf1f76912a2cc55
links:
  - to: map-layer-and-viewport-state-management
    relation: depends_on
    description: >-
      Timebar updates trigger Redux actions that synchronize with map viewport
      state
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Coordinates temporal data display (time range selection, event/detection counts) through timebar controls that dispatch Redux actions and update Jotai mapInstanceAtom. Drag-selecting time ranges triggers setHighlightedTime actions and enables map popups. Layer visibility updates populate hover tooltips with detection counts.

## Related

- depends on [[map-layer-and-viewport-state-management]] — Timebar updates trigger Redux actions that synchronize with map viewport state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
