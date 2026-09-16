---
name: Vessel Group Report Configuration
slug: vessel-group-report-configuration
type: system
sources:
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts
    hash: e10b07f6828f19fda91913123e3a4674448894f95436fc4a70b42bc77d1b1f0a
sources_digest: c4374465ff88d2604dac74d963d0d775a8053716b66e291d7f55c0201ef07af7
links:
  - to: report-timeseries-pipeline
    relation: produces
    description: >-
      Generates dataview instances that drive layer composition and timeseries
      data retrieval
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Consumes default dataset IDs and dataview slugs from workspace
      configuration
generator:
  version: 1
covers:
  - symbol: VesselGroupActivityDataviewId
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L39-L40
  - symbol: isVesselGroupActivityDataview
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L50-L52
  - symbol: normalizeVesselGroupDatasetId
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L54-L55
  - symbol: VesselGroupActivityDatasetsParams
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L57-L61
  - symbol: getVesselGroupActivityDatasets
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L63-L79
  - symbol: VesselGroupActivityDataview
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L81-L84
  - symbol: VesselGroupActivityDataviewParams
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L86-L91
  - symbol: getIsPrivateDataset
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L93-L93
  - symbol: getVesselGroupActivityDataview
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L95-L131
  - symbol: VesselGroupEventsDataviewId
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L133-L134
  - symbol: VGReportEventsSubCategory
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L149-L149
  - symbol: GetReportVesselGroupVisibleDataviewsParams
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L161-L166
  - symbol: getReportVesselGroupVisibleDataviews
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L167-L190
  - symbol: getVesselGroupDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L192-L213
  - symbol: getVesselGroupActivityDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L215-L248
  - symbol: getVesselGroupEventDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L250-L275
  - symbol: getVesselGroupEncountersDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L277-L282
  - symbol: getVesselGroupLoiteringDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L284-L289
  - symbol: getVesselGroupPortVisitsDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L291-L296
  - symbol: getVesselGroupEventsDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts:L298-L311
---

<!-- context:generated:start -->

## Summary

Factory functions and type-safe identifiers for constructing dataview instances scoped to vessel groups, mapping activity datasets (fishing, presence) and event types (encounters, loitering, port visits, gaps) to report-specific configurations. Normalizes dataset IDs across versioning and access-level changes.

## Related

- produces [[report-timeseries-pipeline]] — Generates dataview instances that drive layer composition and timeseries data retrieval
- depends on [[workspace-routing-state]] — Consumes default dataset IDs and dataview slugs from workspace configuration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
