---
name: Data Download Portal routing and layout
slug: data-download-portal-routing-and-layout
type: system
sources:
  - path: apps/data-download-portal/src/routes/__root.tsx
    hash: 5e8e7dc003d4682eba8fd7ac90415ec2536bdffea6f8ef69cd843c81ea5a44f0
  - path: apps/data-download-portal/src/routes/datasets.$datasetId.tsx
    hash: 98683e1b5d31fc67d89f9fadaf14753bba7cd3142ae2d90d94b7b7ea200b8f1c
  - path: apps/data-download-portal/src/routes/index.tsx
    hash: 7efbaea13c825f9596e91ef0cb8d992173cce949cdf98ade95baeebdd37b867c
  - path: apps/data-download-portal/src/routes/report.$reportId.tsx
    hash: 16ee119e8a654a51278b5826864d3a2f281a74c3345d74c0c328349677760019
  - path: apps/data-download-portal/src/routeTree.gen.ts
    hash: 47fd858338f8c389de5dbf9c2dd06a9c037b1c86d6602ddec9d898bdb0754292
sources_digest: 9f9cf343cea28450b1d46753195ba2eda93eab32798bf9ea079704c608c60c2b
links:
  - to: data-download-portal-utilities
    relation: uses
    description: >-
      Root layout component imports CSS modules and depends on utilities for
      date handling and text formatting in nested pages
generator:
  version: 1
covers:
  - symbol: FileRoutesByFullPath
    kind: interface
    at: 'apps/data-download-portal/src/routeTree.gen.ts:L32-L36'
  - symbol: FileRoutesByTo
    kind: interface
    at: 'apps/data-download-portal/src/routeTree.gen.ts:L37-L41'
  - symbol: FileRoutesById
    kind: interface
    at: 'apps/data-download-portal/src/routeTree.gen.ts:L42-L47'
  - symbol: FileRouteTypes
    kind: interface
    at: 'apps/data-download-portal/src/routeTree.gen.ts:L48-L55'
  - symbol: RootRouteChildren
    kind: interface
    at: 'apps/data-download-portal/src/routeTree.gen.ts:L56-L60'
  - symbol: FileRoutesByPath
    kind: interface
    at: 'apps/data-download-portal/src/routeTree.gen.ts:L63-L85'
  - symbol: RootComponent
    kind: function
    at: 'apps/data-download-portal/src/routes/__root.tsx:L13-L35'
---

<!-- context:generated:start -->

## Summary

TanStack Router-based SPA structure for the data download portal. Establishes root layout with header/footer, lazy-loads page components (Home, Dataset detail, Report detail) at the `/`, `/datasets/:datasetId`, and `/report/:reportId` routes respectively. Integrates authentication via useGFWLogin hook with deferred/incomplete login enforcement (commented-out redirect).

## Related

- uses [[data-download-portal-utilities]] — Root layout component imports CSS modules and depends on utilities for date handling and text formatting in nested pages

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
