---
name: Feature Components (Vessels & Reports)
slug: feature-components-vessels-reports
type: system
sources:
  - path: >-
      apps/platform/routes/_platform/_map/map/$category/$workspaceId/vessel.$vesselId.tsx
    hash: b7f4f1762422f21acac238adc54185e9af0019ccdb089b96ca51d5a5c035542b
  - path: apps/platform/routes/_platform/_map/vessel.$vesselId.tsx
    hash: 27789f5c4b7915c85d00438fc6c9be29872f2a61e892f3f4405b8e95f953b742
sources_digest: 1fb9be3da9da24fcfeeef66c351b36f1a6b3d31f847a89f596bfc8a8c0babce9
links:
  - to: ssr-data-loading-pattern
    relation: uses
    description: >-
      Vessel module exports ssrLoadVessel function used by routes for
      server-side data fetching
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

UI components and associated logic for displaying vessel profiles and reports within the map. Includes Vessel detail view, Search interface, and various report types (AreaReport, VesselGroupReport).

## Related

- uses [[ssr-data-loading-pattern]] — Vessel module exports ssrLoadVessel function used by routes for server-side data fetching

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
