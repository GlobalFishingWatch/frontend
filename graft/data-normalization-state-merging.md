---
name: Data Normalization & State Merging
slug: data-normalization-state-merging
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.dataviews.ts
    hash: e10b07f6828f19fda91913123e3a4674448894f95436fc4a70b42bc77d1b1f0a
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.slice.ts
    hash: b6c84e444f2fda91756c2852d286971174ea24e23306166dcb69c5d7c876892f
  - path: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx
    hash: efb24ddc916fb6659cbb98758abe102964e83eadaa8475a3df10007a8e1aca4a
sources_digest: 4274f5dbb14b0cef55427b5c7cb10f6cefda5f9dc4770b2fd073322228fffc7a
links:
  - to: vessel-group-report-configuration
    relation: implements
    description: >-
      Applies dataset normalization logic when filtering and matching datasets
      to dataviews
  - to: vessel-group-report-state-management
    relation: implements
    description: >-
      Normalizes dataset IDs and merges vessel identity data during thunk
      execution
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
  - symbol: NewReportModalProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L37-L42
  - symbol: NewReportModal
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L44-L244
  - symbol: localizeReportString
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L58-L59
  - symbol: updateReport
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L82-L108
  - symbol: createReport
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L110-L149
  - symbol: onDaysFromLatestChange
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L151-L156
  - symbol: onSelectTimeRangeChange
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L158-L163
---

<!-- context:generated:start -->

## Summary

Cross-cutting pattern normalizing dataset identifiers by stripping versions and access-level prefixes (private→public), merging vessel group vessel identities with summaries, and handling locale-aware string preservation for curated reports. Ensures identity matching survives dataset versioning and access changes.

## Related

- implements [[vessel-group-report-configuration]] — Applies dataset normalization logic when filtering and matching datasets to dataviews
- implements [[vessel-group-report-state-management]] — Normalizes dataset IDs and merges vessel identity data during thunk execution

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
