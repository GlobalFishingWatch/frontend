---
name: Aggregated Analytics Across Vessel Groups
slug: aggregated-analytics-across-vessel-groups
type: concept
sources:
  - path: libs/api-types/src/stats.ts
    hash: 0d5ecd980182224d882fc2208511c0c67b5cce09d4a7cfae2eb24b960dd667ac
  - path: libs/api-types/src/vessel-groups-insights.ts
    hash: 4b93b20497badd7977b820e0aed2c70a904dc262620cf0eb1bdbb9234e3b2f20
sources_digest: c40e66a844a2a10c14f8d23dfaae93c05f23e498ba1db284644773f165d040eb
links:
  - to: api-types-type-definitions
    relation: part_of
    description: Aggregation patterns enable batch analytics across vessel fleets
generator:
  version: 1
covers:
  - symbol: StatType
    kind: type
    at: 'libs/api-types/src/stats.ts:L1-L1'
  - symbol: StatsParams
    kind: type
    at: 'libs/api-types/src/stats.ts:L2-L2'
  - symbol: StatsIncludes
    kind: type
    at: 'libs/api-types/src/stats.ts:L3-L3'
  - symbol: StatsGroupBy
    kind: type
    at: 'libs/api-types/src/stats.ts:L4-L15'
  - symbol: StatField
    kind: type
    at: 'libs/api-types/src/stats.ts:L17-L26'
  - symbol: StatFields
    kind: type
    at: 'libs/api-types/src/stats.ts:L28-L30'
  - symbol: StatsByVessel
    kind: type
    at: 'libs/api-types/src/stats.ts:L32-L40'
  - symbol: StatsGroupedBy
    kind: type
    at: 'libs/api-types/src/stats.ts:L42-L47'
  - symbol: VesselGroupInsight
    kind: type
    at: 'libs/api-types/src/vessel-groups-insights.ts:L9-L9'
  - symbol: VesselGroupInsightResponse
    kind: type
    at: 'libs/api-types/src/vessel-groups-insights.ts:L11-L17'
---

<!-- context:generated:start -->

## Summary

VesselGroupInsightResponse structures aggregated insight data by wrapping individual types (InsightCoverage, InsightGaps, InsightFishing, InsightIdentity) with generic VesselGroupInsight<G> decorator adding vesselId and datasets tracking. Most insight properties optional while keeping InsightBase and vesselIdsWithoutIdentity required. Enables multi-vessel fleet analysis via batch requests while maintaining type safety across different insight categories, likely consumed by dashboards and reporting services.

## Related

- part of [[api-types-type-definitions]] — Aggregation patterns enable batch analytics across vessel fleets

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
