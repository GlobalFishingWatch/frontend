---
name: Comparison Aggregation Logic
slug: comparison-aggregation-logic
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityBeforeAfterGraph.tsx
    hash: ae2bca54a85ce20ff65af14ae258a72cc916fd22f47c3ad18b7fe06ec7357c93
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx
    hash: 6bbc12b58c5da999a7df57ff8a47de12cfd48bf1ddac0b51199558eefb4ec2da
sources_digest: 8d390514291fc80560aad4771d360aa2ab7e6907de13aebe8ae688d3d92964f3
links:
  - to: activity-report-redux-state
    relation: depends_on
    description: >-
      Reads selectReportTimeComparison to access comparison configuration (mode,
      dates, period counts) and selectLatestAvailableDataDate for filtering
      future data
  - to: time-series-data-transformation
    relation: uses
    description: >-
      Comparison logic uses bucketing and filtering utilities from timeseries
      module to align data before aggregation
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
  - symbol: ComparisonGraph
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx:L16-L16
  - symbol: bucketAvg
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx:L19-L19
  - symbol: ReportActivityComparisonTotals
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx:L21-L125
---

<!-- context:generated:start -->

## Summary

Components and utilities for computing and displaying aggregated metrics across activity comparison modes. Handles averaging min/max estimate bounds across buckets, splitting data by date threshold (before/after) or sequential pairing (period comparison), computing baseline/comparison totals, and rendering formatted summary metrics with color coding.

## Related

- depends on [[activity-report-redux-state]] — Reads selectReportTimeComparison to access comparison configuration (mode, dates, period counts) and selectLatestAvailableDataDate for filtering future data
- uses [[time-series-data-transformation]] — Comparison logic uses bucketing and filtering utilities from timeseries module to align data before aggregation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
