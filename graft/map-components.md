---
name: Map Components
slug: map-components
type: concept
sources:
  - path: apps/platform/features/layouts/MapMainLayout.tsx
    hash: f26a843e332d5fa5f827decedc626c05e779fbb743bdbf498cd9b2af0d1a8013
sources_digest: f2f098b8e1c5459490b35d9dd5fc1626de3f2c7384570a42f7769c234b23097a
links:
  - to: layout-system
    relation: part_of
    description: MapMainLayout orchestrates lazy rendering of Map and Timebar components
generator:
  version: 1
covers:
  - symbol: Main
    kind: function
    at: 'apps/platform/features/layouts/MapMainLayout.tsx:L29-L78'
---

<!-- context:generated:start -->

## Summary

Primary map visualization and controls (Map, Timebar) lazily loaded via code-splitting to optimize initial bundle. Rendered by MapMainLayout based on route and workspace readiness, with Suspense null fallback to avoid loading spinners. Timebar suppressed for time-comparison reports despite being report locations.

## Related

- part of [[layout-system]] — MapMainLayout orchestrates lazy rendering of Map and Timebar components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
