---
name: Map Routes & Navigation
slug: map-routes-navigation
type: system
sources:
  - path: >-
      apps/platform/routes/_platform/_map/map/$category/$workspaceId/vessel-group-report.$vesselGroupId.tsx
    hash: aeb0b496d51ca914f502ad82fc6ff138bb42c0d4f6210706ef8ab336b1b537c3
  - path: >-
      apps/platform/routes/_platform/_map/map/$category/$workspaceId/vessel-search.tsx
    hash: 31ad7c6bc4342e34155904b452225286b673b9f1043b5640ce015611f0582133
  - path: >-
      apps/platform/routes/_platform/_map/map/$category/$workspaceId/vessel.$vesselId.tsx
    hash: b7f4f1762422f21acac238adc54185e9af0019ccdb089b96ca51d5a5c035542b
  - path: apps/platform/routes/_platform/_map/map/$category/index.tsx
    hash: 3a8e4217f6b6202a7ed7cd4ef9d326b4d054cfa6e53930834e795f58d0b19007
  - path: apps/platform/routes/_platform/_map/map/index.tsx
    hash: 487e90f8f4676884fbc6c4f596bad2e1d63cde02fa5625451909b382a487bc37
  - path: apps/platform/routes/_platform/_map/report.$reportId.tsx
    hash: e3a970dead0b629803f2ff8a3887c6c0204afe13ac603b8cf7c9239b4fc5ae73
  - path: apps/platform/routes/_platform/_map/vessel.$vesselId.tsx
    hash: 27789f5c4b7915c85d00438fc6c9be29872f2a61e892f3f4405b8e95f953b742
sources_digest: f7fc00f170969e3967182ff971f559683b752011707c55198062de19a89f2e95
links:
  - to: feature-components-vessels-reports
    relation: uses
    description: >-
      Routes import and render components from features/_vessels (Vessel,
      Search) and features/_reports (AreaReport, VesselGroupReport)
  - to: route-parameter-validation-seo
    relation: uses
    description: >-
      All map routes delegate query parameter validation to
      validateReportSearchParams, validateSearchQueryParams,
      validateVesselProfileParams, and invoke getRouteHead/getVesselHead from
      router.meta for metadata generation
  - to: ssr-data-loading-pattern
    relation: uses
    description: >-
      Vessel detail routes use ssrLoadVessel for server-side data fetching
      before component render
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

TanStack Router file-based route definitions that organize the platform's map interface into nested URL hierarchies. Handles workspace selection by category, vessel search, vessel detail views, and report displays, with consistent parameter validation and SSR data loading.

## Related

- uses [[feature-components-vessels-reports]] — Routes import and render components from features/_vessels (Vessel, Search) and features/_reports (AreaReport, VesselGroupReport)
- uses [[route-parameter-validation-seo]] — All map routes delegate query parameter validation to validateReportSearchParams, validateSearchQueryParams, validateVesselProfileParams, and invoke getRouteHead/getVesselHead from router.meta for metadata generation
- uses [[ssr-data-loading-pattern]] — Vessel detail routes use ssrLoadVessel for server-side data fetching before component render

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
