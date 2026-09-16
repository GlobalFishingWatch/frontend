---
name: Image Labeler application bootstrap and routing
slug: image-labeler-application-bootstrap-and-routing
type: system
sources:
  - path: apps/image-labeler/src/main.tsx
    hash: fa949cc50c302eea780c318aee842f3a04c7f3913526c314dca27f9ccdfe2db2
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
sources_digest: 245a0fed53014feb473a862d57b50dbfa4ca26787f796eeb90595b4854cdf114
links:
  - to: image-labeler-project-management-ui
    relation: uses
    description: >-
      Root route guards access; index route renders ProjectsList; project detail
      route renders Project component
  - to: image-labeler-redux-api-layer
    relation: depends_on
    description: >-
      main.tsx configures Redux store with all API slices as reducers and
      middleware
  - to: image-labeler-type-definitions
    relation: uses
    description: Routes and components depend on LabellingProject and LabellingTask types
generator:
  version: 1
covers:
  - symbol: Register
    kind: interface
    at: 'apps/image-labeler/src/main.tsx:L19-L21'
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

Redux store configuration and TanStack Router setup. main.tsx bootstraps a Redux store with all five API slices' reducers and middleware, registers the routeTree for file-based routing with TypeScript type safety, wraps Router in Redux Provider, applies GFW base styles, and prevents double-mounting via innerHTML check. __root.tsx establishes the app-level security gateway with authentication-gated access to labelling-project permission, displaying either Spinner (loading), error UI with logout (unauthorized), or full app with header and Outlet (authenticated). routes/index.lazy.tsx and routes/project.$projectId.lazy.tsx enable code splitting for the projects list and project detail pages. The root route validates search params into ProjectSearchState to track activeTaskId.

## Related

- uses [[image-labeler-project-management-ui]] — Root route guards access; index route renders ProjectsList; project detail route renders Project component
- depends on [[image-labeler-redux-api-layer]] — main.tsx configures Redux store with all API slices as reducers and middleware
- uses [[image-labeler-type-definitions]] — Routes and components depend on LabellingProject and LabellingTask types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
