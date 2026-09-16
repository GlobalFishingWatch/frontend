---
name: Report Summary
slug: report-summary
type: system
sources:
  - path: apps/platform/features/_reports/shared/summary/report-summary.hooks.ts
    hash: c512b2bb1dc65e37dd81c08899524cfed3cfe0f465de7f902eca1ddfd8441e0a
  - path: apps/platform/features/_reports/shared/summary/report-summary.utils.ts
    hash: 39dc5ca0719b0eab4a9c5a88da20681354f828de6340e45ab0f285940fea907f
  - path: apps/platform/features/_reports/shared/summary/ReportSummary.tsx
    hash: 4b42c4265f94e82cc78b571e9d2e1d7494decb8ceb28aeacac131d7471c9c0ca
  - path: apps/platform/features/_reports/shared/summary/ReportSummaryActivity.tsx
    hash: 94279b321031d4416cc18994670aa223789282c61dfa10bd79d306c60b3b0bfa
  - path: apps/platform/features/_reports/shared/summary/ReportSummaryEvents.tsx
    hash: 70073d07fe8713b8c265b82bc25f93db1e034219f132be611d50aa4bd1f28bcf
  - path: apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx
    hash: 45826fa03f3a87625df708e4991069bd3162c4548b19ac386cd1a0eacc3757dd
sources_digest: 8861d0d64136a3907c98eb2e6f6d145bedb7379489385673cd112ccfd89101ea
links:
  - to: dataview-layer-management
    relation: uses
    description: >-
      Report summary components integrate with dataview infrastructure
      (selectActiveReportDataviews, upsertDataviewInstance) to display and
      modify layer properties
  - to: placeholder-animation-infrastructure
    relation: depends_on
    description: >-
      ReportSummaryActivity falls back to ReportSummaryPlaceholder when data is
      unavailable
  - to: report-vessel-data-pipeline
    relation: depends_on
    description: >-
      ReportSummaryActivity and ReportSummaryEvents consume vessel count metrics
      and dataset information from report-vessels selectors
generator:
  version: 1
covers:
  - symbol: ReportSummaryProps
    kind: type
    at: 'apps/platform/features/_reports/shared/summary/ReportSummary.tsx:L27-L31'
  - symbol: ReportSummary
    kind: function
    at: 'apps/platform/features/_reports/shared/summary/ReportSummary.tsx:L33-L99'
  - symbol: ReportSummaryActivity
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryActivity.tsx:L45-L206
  - symbol: ReportSummaryEvents
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryEvents.tsx:L26-L105
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L38-L43
  - symbol: ReportSummaryTags
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L45-L217
  - symbol: onToggleFiltersUIOpen
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L64-L66
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L67-L69
  - symbol: onColorClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L70-L79
  - symbol: onTagRemoveClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L81-L83
  - symbol: getHasDataviewSchemaFilters
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.hooks.ts:L12-L26
  - symbol: useGetHasDataviewSchemaFilters
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.hooks.ts:L28-L41
  - symbol: DataviewSource
    kind: type
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.utils.ts:L3-L3
  - symbol: getReportSourcesWithVessels
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.utils.ts:L5-L12
---

<!-- context:generated:start -->

## Summary

A suite of components and hooks that render consolidated summary sections within reports, displaying activity metrics, event data, or detection information alongside active dataview layers. Adapts content based on report category (Activity, Detections, or Events) and manages layer controls.

## Related

- uses [[dataview-layer-management]] — Report summary components integrate with dataview infrastructure (selectActiveReportDataviews, upsertDataviewInstance) to display and modify layer properties
- depends on [[placeholder-animation-infrastructure]] — ReportSummaryActivity falls back to ReportSummaryPlaceholder when data is unavailable
- depends on [[report-vessel-data-pipeline]] — ReportSummaryActivity and ReportSummaryEvents consume vessel count metrics and dataset information from report-vessels selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
