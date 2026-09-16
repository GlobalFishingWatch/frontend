---
name: GFW Base Query
slug: gfw-base-query
type: concept
sources:
  - path: apps/platform/queries/map/chat-api.ts
    hash: 0dcfe199604013f7271d02e6d015039d70198e2a5d3e5ed175af73f92c6bc9eb
  - path: apps/platform/queries/map/data-terminology-api.ts
    hash: 8ea73749da752b04dd34b082257eb79bddecab7cda3c034943f52c9bb4a7b672
  - path: apps/platform/queries/map/report-events-stats-api.ts
    hash: 82d957cd69ce939b49538d44fa8137547fe1999843effabb4683110af764aaa4
  - path: apps/platform/queries/map/search-api.ts
    hash: ff86242899b5ee9433d6514cceb2dfe4b46aa0c7689f39f4c7daa4c642d19cbb
  - path: apps/platform/queries/map/stats-api.ts
    hash: 4a9c5c100f458740e7f15fc3e82cca164748e414bd83682f4728a64974401e51
  - path: apps/platform/queries/map/user-guide-api.ts
    hash: 68d999a0ce103ee5a7477d2f0fba5a1561ab53444dcf838aabc64593cf01093b
  - path: apps/platform/queries/map/vessel-events-api.ts
    hash: 62c70fdfc59e8fd9479fe7a6ad57b226aa4ef84e67948eb4aa4e5fd0b820cfd0
  - path: apps/platform/queries/map/vessel-insight-api.ts
    hash: 164714ff5229d7e7a3b9b1ee56d96fb2868a4df053fde351598ad993c3042a24
sources_digest: 8ce0850039a5fc88ef472ff4133fed0a42dbb671deec963a84d798cf48f89e4c
links: []
generator:
  version: 1
covers:
  - symbol: AgentThread
    kind: type
    at: 'apps/platform/queries/map/chat-api.ts:L14-L18'
  - symbol: DataTerminologyParams
    kind: type
    at: 'apps/platform/queries/map/data-terminology-api.ts:L8-L8'
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
  - symbol: SearchIncludes
    kind: type
    at: 'apps/platform/queries/map/search-api.ts:L19-L19'
  - symbol: SearchOwnerParams
    kind: type
    at: 'apps/platform/queries/map/search-api.ts:L21-L26'
  - symbol: FetchDataviewStatsParams
    kind: type
    at: 'apps/platform/queries/map/stats-api.ts:L22-L26'
  - symbol: CustomBaseQueryArg
    kind: interface
    at: 'apps/platform/queries/map/stats-api.ts:L28-L31'
  - symbol: serializeStatsDataviewKey
    kind: function
    at: 'apps/platform/queries/map/stats-api.ts:L33-L39'
  - symbol: UserGuideParams
    kind: type
    at: 'apps/platform/queries/map/user-guide-api.ts:L8-L8'
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

Custom RTK Query baseQuery abstraction (gfwBaseQuery) providing authenticated HTTP transport, endpoint resolution via datasets-client, and parameter serialization utilities (getQueryParamsResolved). Enables all query APIs to use consistent authentication and URL building without reimplementing these concerns. Exported from queries/base module.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
