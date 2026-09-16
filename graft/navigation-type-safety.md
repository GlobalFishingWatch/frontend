---
name: Navigation Type Safety
slug: navigation-type-safety
type: file
sources:
  - path: apps/platform/test/utils/navigation/navigation-config.ts
    hash: 15a66d4547a8c1a98bd6369665416e4add8ff38cdf2a26b8888a5192fcb0085a
sources_digest: fc9ef2fcc23f25a7bfd4987790459c88535f35dbcba83bb8e610a7c1cddef708
links:
  - to: application-type-definitions
    relation: depends_on
    description: >-
      Depends on AppRouter and RoutePathValues utilities from the router module
      to validate route paths
generator:
  version: 1
covers:
  - symbol: NavigationConfig
    kind: type
    at: 'apps/platform/test/utils/navigation/navigation-config.ts:L6-L6'
---

<!-- context:generated:start -->

## Summary

TypeScript generic type alias that constrains navigation configuration to valid application routes. Wraps @tanstack/react-router's NavigateOptions and enforces compile-time validation against the AppRouter to prevent typos in route paths.

## Related

- depends on [[application-type-definitions]] — Depends on AppRouter and RoutePathValues utilities from the router module to validate route paths

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
