---
name: Route Synchronization Invariant
slug: route-synchronization-invariant
type: concept
sources:
  - path: apps/platform/config/routes.ts
    hash: 3325e5685a60204780fe683dfa2e4d2e8aafb23abe6d4f3baedf318501c07350
sources_digest: 2165f6218499a2b93c35337371d7680052c2f3e9137880ff937f69b487866a1b
links:
  - to: platform-configuration
    relation: implements
    description: >-
      routes.ts establishes the mechanism ensuring route type names stay
      synchronized with URL patterns
generator:
  version: 1
covers:
  - symbol: RoutePathKey
    kind: type
    at: 'apps/platform/config/routes.ts:L31-L31'
  - symbol: RoutePathValues
    kind: type
    at: 'apps/platform/config/routes.ts:L32-L32'
  - symbol: ROUTE_TYPES
    kind: type
    at: 'apps/platform/config/routes.ts:L35-L35'
---

<!-- context:generated:start -->

## Summary

Critical design constraint: URL patterns and Redux location.type identifiers must never drift. Implemented via routes.ts that auto-generates ROUTE_TYPES constant object from ROUTE_PATHS keys using Object.fromEntries, ensuring any new route must update both simultaneously or fail type checking.

## Related

- implements [[platform-configuration]] — routes.ts establishes the mechanism ensuring route type names stay synchronized with URL patterns

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
