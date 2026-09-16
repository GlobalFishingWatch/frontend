---
name: Activity Graph Rendering
slug: activity-graph-rendering
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfterGraph.tsx
    hash: ae2bca54a85ce20ff65af14ae258a72cc916fd22f47c3ad18b7fe06ec7357c93
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx
    hash: da75ac418bc124a1dc54c1d279693673b51f7595357d1630cab1fde3ed45545a
  - path: apps/platform/features/_reports/tabs/activity/ReportActivityEvolution.tsx
    hash: 13cc30b962333e95e28b92cdb2d48f9f0c6126935e1d27aacfe815301834ce4f
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparisonGraph.tsx
    hash: bad06c3ffe26d75cef9df4245f1c9a6363469a2744f9d1ceaa4036cd335eee5c
sources_digest: 474c2bdc71860668b94bf29028b92f81692d6576439a2226cd9c43be3ffd6405
links:
  - to: activity-report-redux-state
    relation: depends_on
    description: >-
      Graphs read selectReportTimeComparison, selectLatestAvailableDataDate, and
      selectReportComparisonDataviews to access comparison configuration and
      temporal bounds
  - to: comparison-aggregation-logic
    relation: uses
    description: >-
      ReportActivityPeriodComparisonGraph and ReportActivityBeforeAfterGraph use
      comparison totals computation to calculate baseline/comparison sums and
      derived metrics
  - to: time-series-data-transformation
    relation: uses
    description: >-
      Graphs call formatEvolutionData to fill temporal gaps, formatDateTicks for
      locale-aware formatting, and getFourwingsInterval for aggregation interval
      selection
generator:
  version: 1
covers:
  - symbol: formatDateTicks
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfterGraph.tsx:L27-L48
  - symbol: ReportActivityBeforeAfterGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfterGraph.tsx:L52-L163
  - symbol: ReportActivityDatasetComparisonProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L28-L32
  - symbol: filterDataBySublayer
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L34-L65
  - symbol: findDataviewData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L67-L71
  - symbol: calculateXDomain
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L73-L83
  - symbol: calculateYAxisDomain
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L85-L100
  - symbol: ReportActivityDatasetComparisonGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L102-L283
  - symbol: EvolutionTooltipContentProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityEvolution.tsx:L34-L39
  - symbol: ReportActivityEvolution
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityEvolution.tsx:L41-L294
  - symbol: formatDateTicks
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparisonGraph.tsx:L34-L46
  - symbol: ReportActivityPeriodComparisonGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparisonGraph.tsx:L50-L232
---

<!-- context:generated:start -->

## Summary

Recharts-based visualization components for activity data, supporting evolution time-series, before/after comparison, period-to-period comparison, and dual-axis dataset comparison graphs. Each component handles data filtering, formatting, domain calculation, axis configuration, and tooltip/legend rendering with proper color coding and axis padding.

## Related

- depends on [[activity-report-redux-state]] — Graphs read selectReportTimeComparison, selectLatestAvailableDataDate, and selectReportComparisonDataviews to access comparison configuration and temporal bounds
- uses [[comparison-aggregation-logic]] — ReportActivityPeriodComparisonGraph and ReportActivityBeforeAfterGraph use comparison totals computation to calculate baseline/comparison sums and derived metrics
- uses [[time-series-data-transformation]] — Graphs call formatEvolutionData to fill temporal gaps, formatDateTicks for locale-aware formatting, and getFourwingsInterval for aggregation interval selection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
