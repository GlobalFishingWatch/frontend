---
name: SSR Data Loading Pattern
slug: ssr-data-loading-pattern
type: concept
sources:
  - path: >-
      apps/platform/routes/_platform/_map/map/$category/$workspaceId/vessel.$vesselId.tsx
    hash: b7f4f1762422f21acac238adc54185e9af0019ccdb089b96ca51d5a5c035542b
  - path: apps/platform/routes/_platform/_map/vessel.$vesselId.tsx
    hash: 27789f5c4b7915c85d00438fc6c9be29872f2a61e892f3f4405b8e95f953b742
sources_digest: 1fb9be3da9da24fcfeeef66c351b36f1a6b3d31f847a89f596bfc8a8c0babce9
links:
  - to: route-parameter-validation-seo
    relation: produces
    description: >-
      SSR loader output (vessel data) is passed to getVesselHead to generate
      dynamic SEO metadata
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Server-side rendering strategy where route loaders (ssrLoadVessel) fetch data asynchronously before component mount, with results passed to head generation for SEO and to components for hydration. Ensures data is available during initial render and in meta tags.

## Related

- produces [[route-parameter-validation-seo]] — SSR loader output (vessel data) is passed to getVesselHead to generate dynamic SEO metadata

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
