---
name: Route Hooks
slug: route-hooks
type: file
sources:
  - path: apps/platform/router/routes.hook.ts
    hash: 4ad2aecc71b5f1b2e2701ab20d7305d353a2d545e9f090f30b0f8c6acd6ab0a1
sources_digest: 3a877cbea020d439984c0d384ccf9501d21409163fcbb5d6984b9ba7f7ef1120
links:
  - to: location-state
    relation: depends_on
    description: useBeforeUnload queries Redux state for workspace save status
  - to: router-core
    relation: uses
    description: All hooks use TanStack Router navigation and state APIs
generator:
  version: 1
covers:
  - symbol: AppNavigateOptions
    kind: type
    at: 'apps/platform/router/routes.hook.ts:L17-L19'
  - symbol: useAppSearch
    kind: function
    at: 'apps/platform/router/routes.hook.ts:L28-L30'
  - symbol: useReplaceQueryParams
    kind: function
    at: 'apps/platform/router/routes.hook.ts:L32-L60'
  - symbol: useBeforeUnload
    kind: function
    at: 'apps/platform/router/routes.hook.ts:L62-L86'
---

<!-- context:generated:start -->

## Summary

Custom React hooks abstracting routing concerns: useAppSearch reads root-level query params with loose validation, useReplaceQueryParams wraps router.navigate to merge/clear params with scroll reset, useBeforeUnload shows confirmation modal when leaving routes with unsaved workspace changes (includes 400ms setTimeout to ensure UI update after preventDefault, only installs listener when all conditions met).

## Related

- depends on [[location-state]] — useBeforeUnload queries Redux state for workspace save status
- uses [[router-core]] — All hooks use TanStack Router navigation and state APIs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
