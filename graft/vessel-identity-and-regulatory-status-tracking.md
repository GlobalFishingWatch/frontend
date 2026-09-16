---
name: Vessel Identity and Regulatory Status Tracking
slug: vessel-identity-and-regulatory-status-tracking
type: concept
sources:
  - path: libs/api-types/src/vessel-insights.ts
    hash: 9b44a73449182ac1d95744979772a2db797ecd53642b4f43cc9aa8906840dca0
sources_digest: 9d58bd74cc72a75ca6ec16e09a7dee3a2dcc418a3226a12b18ae6a4e157cd4db
links:
  - to: api-type-contracts
    relation: part_of
    description: >-
      InsightIdentity and related types form part of the comprehensive API type
      definitions for vessel monitoring insights
generator:
  version: 1
covers:
  - symbol: InsightType
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L1-L7'
  - symbol: InsightBase
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L9-L14'
  - symbol: InsightValueInPeriod
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L16-L21'
  - symbol: InsightCoverage
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L23-L27'
  - symbol: InsightFishing
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L29-L38'
  - symbol: InsightGaps
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L40-L47'
  - symbol: InsightIdentityEntry
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L49-L53'
  - symbol: InsightIdentityMOU
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L55-L60'
  - symbol: InsightIdentityIUU
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L62-L64'
  - symbol: InsightIdentityFlagsChanges
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L66-L68'
  - symbol: InsightIdentity
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L70-L74'
  - symbol: InsightResponse
    kind: type
    at: 'libs/api-types/src/vessel-insights.ts:L76-L81'
---

<!-- context:generated:start -->

## Summary

Specialized type hierarchy within vessel-insights.ts that captures vessel regulatory listing status (IUU designation, flag changes, MOU list status) as categorical values stored as strings rather than enums, with historical change records tracked via InsightValueInPeriod. The design defers client-side event detail lookup by using string arrays (aisOff, eventsInNoTakeMpas) to reference event IDs, allowing the backend to manage event aggregation and filtering separately.

## Related

- part of [[api-type-contracts]] — InsightIdentity and related types form part of the comprehensive API type definitions for vessel monitoring insights

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
