---
name: Map Routes
slug: map-routes
type: system
sources:
  - path: apps/platform/routes/_platform/_map/map.tsx
    hash: 1f549cfe005dc68385d39224d2cb16dec3c81c6517930b428598383cf0de81b3
  - path: apps/platform/routes/_platform/_map/map/$category/$workspaceId.tsx
    hash: c5de4ba7fb514d1fb8d0e29c3d188253d18d780e8b397e6aba1afa43c9a62345
  - path: apps/platform/routes/_platform/_map/map/$category/$workspaceId/index.tsx
    hash: d84da79fcf8678786e9bad1014b8948352af64160d90049d007d903b7c6963c6
  - path: >-
      apps/platform/routes/_platform/_map/map/$category/$workspaceId/ports-report.$portId.tsx
    hash: 16d049e8ace2df383414a01dfd5a8ddd884dc09c4217a8ed6b3bf66e8d5de055
  - path: >-
      apps/platform/routes/_platform/_map/map/$category/$workspaceId/report.{-$datasetId}.{-$areaId}.tsx
    hash: 89f8ac515c0edcfd8c51596d84712dc82417d2aa7825653cba7de191eadd13d3
sources_digest: 0dc593bc361ad7f579509241d374066ef9e794d5bab4eff73cb00106dc7736c1
links:
  - to: platform-layout-routes
    relation: part_of
    description: All nested under _platform/_map layout
  - to: route-configuration
    relation: uses
    description: Routes validate search params using validateReportSearchParams
  - to: seo-and-metadata
    relation: uses
    description: Routes call getRouteHead for page metadata
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Routes for map-centric features nested under _map pathless layout: map.tsx establishes /map path without rendering component (relies on Outlet), workspace routes display map with sidebar/timebar (map/$category/$workspaceId/index.tsx), report routes display area/ports analysis (report.{-$datasetId}.{-$areaId}.tsx, ports-report.$portId.tsx). Optional parameters use {-$param} syntax for clean URLs; all validate search params and generate metadata.

## Related

- part of [[platform-layout-routes]] — All nested under _platform/_map layout
- uses [[route-configuration]] — Routes validate search params using validateReportSearchParams
- uses [[seo-and-metadata]] — Routes call getRouteHead for page metadata

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
