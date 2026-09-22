---
name: Route Pattern Matching with Legacy Fallback
slug: route-pattern-matching-with-legacy-fallback
type: concept
sources:
  - path: libs/skills/src/encode-url/routes.ts
    hash: 3ba39549aeae402c1f647141dd9da2801e7bfb1f8a486068a21536b8237b877e
sources_digest: d94fb6cde922c7436d9c14699d808cbebefe426a992b37ed55db7f06c7da5115
links:
  - to: encode-url-routes-routing-utilities
    relation: implements
    description: matchRoutePath implements the legacy pattern fallback logic
generator:
  version: 1
covers:
  - symbol: MapRouteType
    kind: type
    at: 'libs/skills/src/encode-url/routes.ts:L12-L20'
  - symbol: MapRouteParams
    kind: type
    at: 'libs/skills/src/encode-url/routes.ts:L22-L31'
  - symbol: MapRoute
    kind: type
    at: 'libs/skills/src/encode-url/routes.ts:L33-L33'
  - symbol: RouteNavigation
    kind: type
    at: 'libs/skills/src/encode-url/routes.ts:L35-L38'
  - symbol: required
    kind: function
    at: 'libs/skills/src/encode-url/routes.ts:L40-L46'
  - symbol: getRouteNavigation
    kind: function
    at: 'libs/skills/src/encode-url/routes.ts:L52-L111'
  - symbol: parseParamSegment
    kind: function
    at: 'libs/skills/src/encode-url/routes.ts:L116-L121'
  - symbol: buildRoutePath
    kind: function
    at: 'libs/skills/src/encode-url/routes.ts:L124-L133'
  - symbol: matchPattern
    kind: function
    at: 'libs/skills/src/encode-url/routes.ts:L162-L183'
  - symbol: matchRoutePath
    kind: function
    at: 'libs/skills/src/encode-url/routes.ts:L188-L207'
---

<!-- context:generated:start -->

## Summary

matchRoutePath parses pathnames into MapRoute types using ROUTE_PATTERNS, with fallback to LEGACY_ROUTE_PATTERNS before applying defaults. This avoids ambiguity where new patterns might conflict with old routes and ensures backward compatibility without user disruption, critical for shared URLs remaining valid across platform versions.

## Related

- implements [[encode-url-routes-routing-utilities]] — matchRoutePath implements the legacy pattern fallback logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
