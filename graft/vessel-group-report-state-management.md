---
name: Vessel Group Report State Management
slug: vessel-group-report-state-management
type: system
sources:
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.hooks.ts
    hash: bc35e089f8d25bf1bf6e7d1b5452e512f66506fc3d0e64f3ea8d473609d787d6
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.selectors.ts
    hash: b5a3b34892359b1bb19d4c6e80a6ea560ff22293bc073a130d6f66df235e952e
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts
    hash: b6c84e444f2fda91756c2852d286971174ea24e23306166dcb69c5d7c876892f
sources_digest: ce06958a9d30962bfa5df5b634b31da127e086f98e593ce7c278e9dbb826eda3
links:
  - to: modal-state-management
    relation: uses
    description: Dispatches vessel groups modal actions for editing workflows
  - to: vessel-group-report-configuration
    relation: uses
    description: >-
      Calls dataview configuration functions to augment activity/event views
      with vessel group context
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Reads vessel group ID from router, workspace state for context, and
      responds to workspace tab navigation
generator:
  version: 1
covers:
  - symbol: useFetchVesselGroupReport
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.hooks.ts:L14-L31
  - symbol: useEditVesselGroupModal
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.hooks.ts:L33-L46
  - symbol: selectFetchVGRParamsByInsight
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.selectors.ts:L34-L37
  - symbol: selectVGRInsightById
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.selectors.ts:L49-L56
  - symbol: VesselGroupReport
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L23-L25
  - symbol: ReportState
    kind: interface
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L27-L32
  - symbol: VesselGroupReportSliceState
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L34-L34
  - symbol: FetchVesselGroupReportThunkParams
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L43-L45
  - symbol: fetchVesselGroupVesselIdentities
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L47-L59
  - symbol: selectVGRStatus
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L132-L133
  - symbol: selectVGRError
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L134-L134
  - symbol: selectVGRData
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts:L135-L136
---

<!-- context:generated:start -->

## Summary

Redux slice and selectors managing vessel group report data lifecycle: fetching group metadata and vessel identities, merging with dataset/dataview context, and deriving insights. Implements client-side deduplication via thunk conditions and responds to tab navigation.

## Related

- uses [[modal-state-management]] — Dispatches vessel groups modal actions for editing workflows
- uses [[vessel-group-report-configuration]] — Calls dataview configuration functions to augment activity/event views with vessel group context
- depends on [[workspace-routing-state]] — Reads vessel group ID from router, workspace state for context, and responds to workspace tab navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
