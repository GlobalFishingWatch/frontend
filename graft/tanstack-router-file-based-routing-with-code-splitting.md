---
name: TanStack Router file-based routing with code splitting
slug: tanstack-router-file-based-routing-with-code-splitting
type: concept
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
  - path: apps/image-labeler/src/routes/__root.tsx
    hash: bbbe30c064a577d4658708d7910f2152ab89bc2365804b6722fdcf82991c67fc
  - path: apps/image-labeler/src/routes/index.lazy.tsx
    hash: 07841562809a7b7868ba928defdbea628fa8cb900b95311ee2b6c108a1b4bc2d
  - path: apps/image-labeler/src/routes/project.$projectId.lazy.tsx
    hash: 889e9f313c08cf56e10b8a8bfabc770393e216e02f6142d98d8ad69831c00c30
  - path: apps/image-labeler/src/routes/project.$projectId.tsx
    hash: 0c888423884c537a8571fe9b36cb4b3e3e08503d12b8514014234ee8768ef4e7
  - path: apps/image-labeler/src/routeTree.gen.ts
    hash: 609ad773f2d7e0038a73f1eeeddf7f767e1e7be83ef2be5fb970747cb7e60fa2
sources_digest: db484eb94796d5897228cbb6954c78814f9873bfd409aeedd2fbfedf3623d31b
links: []
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
  - symbol: FileRoutesByFullPath
    kind: interface
    at: 'apps/image-labeler/src/routeTree.gen.ts:L31-L34'
  - symbol: FileRoutesByTo
    kind: interface
    at: 'apps/image-labeler/src/routeTree.gen.ts:L35-L38'
  - symbol: FileRoutesById
    kind: interface
    at: 'apps/image-labeler/src/routeTree.gen.ts:L39-L43'
  - symbol: FileRouteTypes
    kind: interface
    at: 'apps/image-labeler/src/routeTree.gen.ts:L44-L51'
  - symbol: RootRouteChildren
    kind: interface
    at: 'apps/image-labeler/src/routeTree.gen.ts:L52-L55'
  - symbol: FileRoutesByPath
    kind: interface
    at: 'apps/image-labeler/src/routeTree.gen.ts:L58-L73'
  - symbol: RootComponent
    kind: function
    at: 'apps/image-labeler/src/routes/__root.tsx:L17-L54'
  - symbol: ProjectSearchState
    kind: type
    at: 'apps/image-labeler/src/routes/project.$projectId.tsx:L3-L5'
---

<!-- context:generated:start -->

## Summary

Declarative routing pattern used across data-download-portal and image-labeler. createFileRoute and createLazyFileRoute APIs map file structure to URL patterns with automatic code splitting via lazy imports (e.g., pages/home/home lazily loaded at / route). Route tree is auto-generated and type-safe, mapping routes by fullPath, to path, and ID. Lazy routes defer component bundle until navigation, improving initial load. Root route establishes layout wrapper with header/footer and nested Outlet. Dynamic routes capture URL params (e.g., $datasetId, $projectId) and optionally validate/transform search params via validateSearch.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
