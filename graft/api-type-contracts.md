---
name: API Type Contracts
slug: api-type-contracts
type: system
sources:
  - path: libs/api-types/src/vessel-insights.ts
    hash: 9b44a73449182ac1d95744979772a2db797ecd53642b4f43cc9aa8906840dca0
  - path: libs/api-types/src/vessel-report.ts
    hash: c0219e3da22e7eaca6e6fb441bd660c3398dcf7ce988fae8eb2283ff7ba37388
  - path: libs/api-types/src/vessel.ts
    hash: b4247655ddb94f516d3234b61d075cd0d50f99c76ddf9946ea52bc73663174a6
  - path: libs/api-types/src/vesselGroups.ts
    hash: 9671d06bb8aef9d024edbbe81cf5f4e966e72ec7fdb899596ea65e12cf77e7bb
  - path: libs/api-types/src/workspaces.ts
    hash: bf0229d0be419d362ff2a940987a71c817bb6119b53c503ef06fef6edbc3c400
sources_digest: 298279c638fa87419b512fec43f4c4d5f391b0e4563fb6cac41331aa9be43381
links:
  - to: geospatial-data-transformations
    relation: depends_on
    description: >-
      API types are consumed by data-transforms modules which normalize and
      filter coordinates, events, and vessel tracks derived from API responses
  - to: vessel-identity-and-regulatory-status-tracking
    relation: implements
    description: >-
      InsightIdentity and related types in vessel-insights.ts implement the
      contract for tracking vessel regulatory classifications (IUU designation,
      flag changes, MOU list status) over time periods
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
  - symbol: ReportVessel
    kind: type
    at: 'libs/api-types/src/vessel-report.ts:L1-L19'
  - symbol: ReportVesselsByDataset
    kind: type
    at: 'libs/api-types/src/vessel-report.ts:L21-L23'
  - symbol: Authorization
    kind: type
    at: 'libs/api-types/src/vessel.ts:L1-L7'
  - symbol: VesselTypeV2
    kind: type
    at: 'libs/api-types/src/vessel.ts:L9-L18'
  - symbol: Vessel
    kind: type
    at: 'libs/api-types/src/vessel.ts:L20-L56'
  - symbol: VesselSearch
    kind: type
    at: 'libs/api-types/src/vessel.ts:L58-L62'
  - symbol: RelatedVesselSearchMerged
    kind: type
    at: 'libs/api-types/src/vessel.ts:L64-L66'
  - symbol: VesselGroupVessel
    kind: type
    at: 'libs/api-types/src/vesselGroups.ts:L1-L7'
  - symbol: VesselGroupVesselsSummary
    kind: type
    at: 'libs/api-types/src/vesselGroups.ts:L9-L13'
  - symbol: VesselGroup
    kind: type
    at: 'libs/api-types/src/vesselGroups.ts:L15-L25'
  - symbol: VesselGroupUpsert
    kind: type
    at: 'libs/api-types/src/vesselGroups.ts:L27-L27'
  - symbol: ApiAppName
    kind: type
    at: 'libs/api-types/src/workspaces.ts:L3-L3'
  - symbol: WorkspaceViewAccessType
    kind: type
    at: 'libs/api-types/src/workspaces.ts:L9-L12'
  - symbol: WorkspaceEditAccessType
    kind: type
    at: 'libs/api-types/src/workspaces.ts:L13-L14'
  - symbol: WorkspaceViewport
    kind: type
    at: 'libs/api-types/src/workspaces.ts:L16-L20'
  - symbol: OwnerType
    kind: type
    at: 'libs/api-types/src/workspaces.ts:L22-L22'
  - symbol: Workspace
    kind: type
    at: 'libs/api-types/src/workspaces.ts:L24-L41'
  - symbol: WorkspaceUpsert
    kind: type
    at: 'libs/api-types/src/workspaces.ts:L43-L46'
---

<!-- context:generated:start -->

## Summary

Core TypeScript type definitions that establish the contract between backend services and frontend consumers across vessel reporting, vessel identity, insights, workspace configuration, and vessel group management domains. These types enable type-safe data exchange with minimal runtime dependencies, serving as the foundation for all API interactions throughout the monorepo.

## Related

- depends on [[geospatial-data-transformations]] — API types are consumed by data-transforms modules which normalize and filter coordinates, events, and vessel tracks derived from API responses
- implements [[vessel-identity-and-regulatory-status-tracking]] — InsightIdentity and related types in vessel-insights.ts implement the contract for tracking vessel regulatory classifications (IUU designation, flag changes, MOU list status) over time periods

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
