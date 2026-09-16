---
name: Route Configuration
slug: route-configuration
type: system
sources:
  - path: apps/platform/router/routes.search.ts
    hash: 1d1d3e8eb809c7e486c384a37695250af5c3b4d93bcc1c822108c4ba223b380d
  - path: apps/platform/router/routes.selectors.ts
    hash: fc0a7e149872d41810de358a059948527adc22dc9be07d61963c8d71ab156b93
  - path: apps/platform/router/routes.ts
    hash: ae0e43d2620f53de13ba60784c0812884e5058d208d3173efbaf4f10122aedf9
  - path: apps/platform/router/routes.types.ts
    hash: 0abac6c98589a652521fce4fd3c0f88af7e667b1083203642d6b64d4a3630fe5
  - path: apps/platform/router/routes.utils.ts
    hash: a15dca888dc39c88d03e96d5fd4873d24cf98faf77700e1624ea1ed7cdaa8cab
sources_digest: 57c5b8969cce49d55c4d7c9e78b987f4e100275da9106ea2cccebb7be2d493d4
links:
  - to: route-synchronization
    relation: uses
    description: >-
      Router sync uses route type mappings and utilities to normalize route
      information
  - to: router-core
    relation: implements
    description: Provides route definitions imported by router creation functions
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
  - symbol: selectLocation
    kind: function
    at: 'apps/platform/router/routes.selectors.ts:L26-L26'
  - symbol: QueryParamProperty
    kind: type
    at: 'apps/platform/router/routes.selectors.ts:L127-L127'
  - symbol: selectQueryParam
    kind: function
    at: 'apps/platform/router/routes.selectors.ts:L128-L132'
  - symbol: LinkToPayload
    kind: type
    at: 'apps/platform/router/routes.types.ts:L5-L14'
  - symbol: LinkTo
    kind: type
    at: 'apps/platform/router/routes.types.ts:L20-L27'
  - symbol: normalizeRoutePath
    kind: function
    at: 'apps/platform/router/routes.utils.ts:L31-L33'
  - symbol: mapRoutePathToType
    kind: function
    at: 'apps/platform/router/routes.utils.ts:L43-L51'
  - symbol: mapRouteIdToPath
    kind: function
    at: 'apps/platform/router/routes.utils.ts:L57-L61'
  - symbol: getCurrentAppUrl
    kind: function
    at: 'apps/platform/router/routes.utils.ts:L67-L79'
---

<!-- context:generated:start -->

## Summary

Centralized routing system defining platform navigation structure, URL parameter validation, route classification, and utility functions for routing logic. Comprises route definitions (routes.ts), search parameter schemas with Zod validation (routes.search.ts), selectors for state queries (routes.selectors.ts), utility functions (routes.utils.ts), and type contracts (routes.types.ts). Key design: leaf-subpath imports (e.g., features/_reports/reports.config) to avoid bundling heavy dependencies into every entry chunk.

## Related

- uses [[route-synchronization]] — Router sync uses route type mappings and utilities to normalize route information
- implements [[router-core]] — Provides route definitions imported by router creation functions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
