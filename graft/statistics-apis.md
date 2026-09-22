---
name: Statistics APIs
slug: statistics-apis
type: system
sources:
  - path: apps/platform/queries/map/report-events-stats-api.ts
    hash: 82d957cd69ce939b49538d44fa8137547fe1999843effabb4683110af764aaa4
  - path: apps/platform/queries/map/stats-api.ts
    hash: 4a9c5c100f458740e7f15fc3e82cca164748e414bd83682f4728a64974401e51
sources_digest: 2e85c7c757fc1bbd50fc32c98efdd5c163d5372553ab020b5569bf26a82d21dd
links:
  - to: gfw-base-query
    relation: depends_on
    description: >-
      Both use gfwBaseQuery for HTTP requests and getQueryParamsResolved for
      parameter serialization
  - to: query-api-infrastructure
    relation: uses
    description: Both APIs registered in store via inject-api
generator:
  version: 1
covers:
  - symbol: BaseReportEventsVesselsParamsFilters
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L22-L36'
  - symbol: BaseReportEventsVesselsParams
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L38-L46'
  - symbol: ReportEventsVesselsParams
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L48-L52'
  - symbol: ReportEventsStatsParams
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L54-L60'
  - symbol: ReportEventsStatsResponseGroups
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L62-L67'
  - symbol: ReportEventsStatsResponse
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L69-L75'
  - symbol: GetReportEventParams
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L77-L95'
  - symbol: ReportEventsVesselsResponse
    kind: type
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L97-L97'
  - symbol: getFilterWithOperator
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L101-L113'
  - symbol: getEncounterTypesFilter
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L115-L124'
  - symbol: parseEventsFilters
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L126-L146'
  - symbol: getBaseStatsQuery
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L148-L171'
  - symbol: getEventsStatsQuery
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L173-L178'
  - symbol: getEventsVesselQuery
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L180-L185'
  - symbol: selectReportEventsStats
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L288-L289'
  - symbol: selectReportEventsVessels
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L291-L292'
  - symbol: selectReportEventsPorts
    kind: function
    at: 'apps/platform/queries/map/report-events-stats-api.ts:L294-L295'
  - symbol: FetchDataviewStatsParams
    kind: type
    at: 'apps/platform/queries/map/stats-api.ts:L22-L26'
  - symbol: CustomBaseQueryArg
    kind: interface
    at: 'apps/platform/queries/map/stats-api.ts:L28-L31'
  - symbol: serializeStatsDataviewKey
    kind: function
    at: 'apps/platform/queries/map/stats-api.ts:L33-L39'
---

<!-- context:generated:start -->

## Summary

RTK Query services for fetching aggregated fisheries dataset statistics and fishing event analytics. Handles dataset extent validation, temporal bounds reconciliation, multi-dataset aggregation via Promise.allSettled (graceful partial failure), and cache key normalization. Infers result type (detections vs. vessels) from dataset units and logs warnings on unit mismatches.

## Related

- depends on [[gfw-base-query]] — Both use gfwBaseQuery for HTTP requests and getQueryParamsResolved for parameter serialization
- uses [[query-api-infrastructure]] — Both APIs registered in store via inject-api

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
