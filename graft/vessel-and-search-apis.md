---
name: Vessel and Search APIs
slug: vessel-and-search-apis
type: system
sources:
  - path: apps/platform/queries/map/search-api.ts
    hash: ff86242899b5ee9433d6514cceb2dfe4b46aa0c7689f39f4c7daa4c642d19cbb
  - path: apps/platform/queries/map/vessel-events-api.ts
    hash: 62c70fdfc59e8fd9479fe7a6ad57b226aa4ef84e67948eb4aa4e5fd0b820cfd0
  - path: apps/platform/queries/map/vessel-insight-api.ts
    hash: 164714ff5229d7e7a3b9b1ee56d96fb2868a4df053fde351598ad993c3042a24
sources_digest: ef00e240298e065e78ef3ac210c3578a1027745f49ec1c19bdc204304d2eddc3
links:
  - to: gfw-base-query
    relation: depends_on
    description: >-
      All rely on gfwBaseQuery and getQueryParamsResolved for HTTP transport and
      parameter handling
  - to: query-api-infrastructure
    relation: uses
    description: All three APIs registered in store via inject-api
generator:
  version: 1
covers:
  - symbol: SearchIncludes
    kind: type
    at: 'apps/platform/queries/map/search-api.ts:L19-L19'
  - symbol: SearchOwnerParams
    kind: type
    at: 'apps/platform/queries/map/search-api.ts:L21-L26'
  - symbol: VesselEventsApiParams
    kind: type
    at: 'apps/platform/queries/map/vessel-events-api.ts:L14-L18'
  - symbol: BaseInsightParams
    kind: type
    at: 'apps/platform/queries/map/vessel-insight-api.ts:L11-L15'
  - symbol: VesselInsightParams
    kind: type
    at: 'apps/platform/queries/map/vessel-insight-api.ts:L17-L19'
  - symbol: VesselGroupInsightParams
    kind: type
    at: 'apps/platform/queries/map/vessel-insight-api.ts:L21-L23'
  - symbol: getBaseQueryParams
    kind: function
    at: 'apps/platform/queries/map/vessel-insight-api.ts:L25-L31'
  - symbol: selectVesselGroupInsight
    kind: function
    at: 'apps/platform/queries/map/vessel-insight-api.ts:L71-L72'
---

<!-- context:generated:start -->

## Summary

RTK Query services for fetching vessel event data, vessel insights, and searching vessels by owner. Implements graceful degradation: search API includes ownership data client-side then filters by flag since backend lacks this capability, avoiding extra round-trips. Events API sorts results reverse-chronologically before caching. Insights API normalizes query parameters to avoid duplication across vessel and vessel-group queries.

## Related

- depends on [[gfw-base-query]] — All rely on gfwBaseQuery and getQueryParamsResolved for HTTP transport and parameter handling
- uses [[query-api-infrastructure]] — All three APIs registered in store via inject-api

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
