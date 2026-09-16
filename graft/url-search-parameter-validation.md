---
name: URL Search Parameter Validation
slug: url-search-parameter-validation
type: concept
sources:
  - path: apps/platform/router/routes.search.ts
    hash: 1d1d3e8eb809c7e486c384a37695250af5c3b4d93bcc1c822108c4ba223b380d
sources_digest: 49f70f7e52ecd1b24ad853039151b593f280fa2e2d3ec19b79dbddb2381fb8f4
links:
  - to: route-configuration
    relation: implements
    description: >-
      Exported validator functions enforce search parameter contracts for
      specific routes
generator:
  version: 1
covers:
  - symbol: optionalNumber
    kind: function
    at: 'apps/platform/router/routes.search.ts:L46-L46'
  - symbol: optionalBoolean
    kind: function
    at: 'apps/platform/router/routes.search.ts:L47-L47'
  - symbol: optionalString
    kind: function
    at: 'apps/platform/router/routes.search.ts:L50-L50'
  - symbol: optionalStringArray
    kind: function
    at: 'apps/platform/router/routes.search.ts:L51-L51'
  - symbol: optionalStringOrArray
    kind: function
    at: 'apps/platform/router/routes.search.ts:L52-L53'
  - symbol: optionalEnum
    kind: function
    at: 'apps/platform/router/routes.search.ts:L54-L55'
  - symbol: optionalLiteralUnion
    kind: function
    at: 'apps/platform/router/routes.search.ts:L56-L57'
  - symbol: validateRootSearchParams
    kind: function
    at: 'apps/platform/router/routes.search.ts:L260-L262'
  - symbol: validateVesselProfileParams
    kind: function
    at: 'apps/platform/router/routes.search.ts:L264-L266'
  - symbol: validateReportSearchParams
    kind: function
    at: 'apps/platform/router/routes.search.ts:L268-L270'
  - symbol: validateSearchQueryParams
    kind: function
    at: 'apps/platform/router/routes.search.ts:L272-L274'
  - symbol: validateSearchParams
    kind: function
    at: 'apps/platform/router/routes.search.ts:L283-L285'
---

<!-- context:generated:start -->

## Summary

Zod-based validation schemas for all route search parameters across the platform, ensuring type-safe serialization/deserialization. Uses fallback adapters and .partial()/.passthrough() to silently coerce malformed params to undefined instead of throwing errors (avoiding blank-page error boundary trips). Complex types like dataviewInstances and mapAnnotations are parsed upstream and validated structurally here. Imports config constants from leaf module paths to keep enums consistent with business logic.

## Related

- implements [[route-configuration]] — Exported validator functions enforce search parameter contracts for specific routes

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
