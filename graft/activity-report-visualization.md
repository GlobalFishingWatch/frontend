---
name: Activity Report Visualization
slug: activity-report-visualization
type: system
sources:
  - path: apps/platform/features/_reports/tabs/activity/download/ReportDownload.tsx
    hash: ab5c9c33085c4fda41de417e7e4d59841d894671fb6b171659a975c262775190
  - path: apps/platform/features/_reports/tabs/activity/ReportActivity.tsx
    hash: 43be9b5a89248ae8ce3265ff1be3add0cf92c83c19f0be22799e081e5073968f
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx
    hash: 139f4945a530a1acab47746261560fe687fb4fb7d83c5d661dc2d0fb7b7ef7f7
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfterGraph.tsx
    hash: ae2bca54a85ce20ff65af14ae258a72cc916fd22f47c3ad18b7fe06ec7357c93
sources_digest: d3095ef3c91f56645251ca8ef0a8309607964771ba6f661d6ca11df9167f03e2
links:
  - to: activity-report-error-handling-and-retry
    relation: implements
    description: >-
      Handles multiple error states with retry logic, concurrent report
      conflicts, geometry failures, and stale report detection
  - to: evolution-graph-time-series
    relation: depends_on
    description: >-
      ReportActivityBeforeAfterGraph and ReportActivity depend on time-series
      data from features/_reports/reports-timeseries.hooks
  - to: report-summary
    relation: uses
    description: >-
      ReportActivity renders ReportSummary component to display consolidated
      metrics and layer controls
  - to: report-vessel-data-pipeline
    relation: depends_on
    description: >-
      ReportActivity conditionally renders ReportVessels component after
      fetching vessel data via useFetchReportVessel
generator:
  version: 1
covers:
  - symbol: ActivityReport
    kind: function
    at: 'apps/platform/features/_reports/tabs/activity/ReportActivity.tsx:L67-L410'
  - symbol: ReportActivityBeforeAfter
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx:L20-L119
  - symbol: trackAndChangeDate
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx:L36-L49
  - symbol: trackAndChangeDuration
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx:L51-L66
  - symbol: trackAndChangeDurationType
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfter.tsx:L68-L83
  - symbol: formatDateTicks
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfterGraph.tsx:L27-L48
  - symbol: ReportActivityBeforeAfterGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfterGraph.tsx:L52-L163
  - symbol: ReportDownload
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/download/ReportDownload.tsx:L16-L42
  - symbol: handleMoreOptionsClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/download/ReportDownload.tsx:L22-L29
---

<!-- context:generated:start -->

## Summary

Renders the activity tab of area and vessel group reports with multi-section display for vessel metrics, evolution graphs, before/after comparisons, and download capabilities. Orchestrates data fetching, error handling, and progressive disclosure across sections with extensive support for concurrent report conflicts, timeouts, and unsupported configurations.

## Related

- implements [[activity-report-error-handling-and-retry]] — Handles multiple error states with retry logic, concurrent report conflicts, geometry failures, and stale report detection
- depends on [[evolution-graph-time-series]] — ReportActivityBeforeAfterGraph and ReportActivity depend on time-series data from features/_reports/reports-timeseries.hooks
- uses [[report-summary]] — ReportActivity renders ReportSummary component to display consolidated metrics and layer controls
- depends on [[report-vessel-data-pipeline]] — ReportActivity conditionally renders ReportVessels component after fetching vessel data via useFetchReportVessel

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
