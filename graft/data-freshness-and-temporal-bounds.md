---
name: Data Freshness and Temporal Bounds
slug: data-freshness-and-temporal-bounds
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx
    hash: 6bbc12b58c5da999a7df57ff8a47de12cfd48bf1ddac0b51199558eefb4ec2da
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparisonGraph.tsx
    hash: bad06c3ffe26d75cef9df4245f1c9a6363469a2744f9d1ceaa4036cd335eee5c
sources_digest: 7bdfae7d63e6f462210ad8523c8a94938c7357abac0a1ac48b14f136cbf5c842
links:
  - to: activity-graph-rendering
    relation: configures
    description: >-
      Graphs use latest data date via ReferenceLine styling to visually mark
      data staleness boundaries
  - to: comparison-aggregation-logic
    relation: validates
    description: >-
      Comparison logic filters out data beyond selectLatestAvailableDataDate to
      ensure only valid historical data is aggregated
generator:
  version: 1
covers:
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

Tracks the latest available data date (selectLatestAvailableDataDate selector) to filter out future data and provide visual indication of where fresh data ends. In period comparison, an 'offsetedLastDataUpdate' calculation shifts the latest data date backward by the time difference between periods, allowing proper marking of stale data. This ensures comparisons only analyze available historical data and users understand data currency.

## Related

- configures [[activity-graph-rendering]] — Graphs use latest data date via ReferenceLine styling to visually mark data staleness boundaries
- validates [[comparison-aggregation-logic]] — Comparison logic filters out data beyond selectLatestAvailableDataDate to ensure only valid historical data is aggregated

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
