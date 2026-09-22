---
name: Time-Based Comparison Strategies
slug: time-based-comparison-strategies
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx
    hash: 6bbc12b58c5da999a7df57ff8a47de12cfd48bf1ddac0b51199558eefb4ec2da
  - path: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts
    hash: 038b2f2c1baafd6f2c826e82112a8c91a32b89fb03b1160afde8ac136dcfdb8d
sources_digest: d643db04af6f34a6bcd90d80660cbf7e8d7ddba0a630557096d9c7b5d2b51517
links:
  - to: activity-report-ui-components
    relation: implements
    description: >-
      ReportActivityPeriodComparison and ReportActivityGraphSelector enforce and
      switch between these two comparison strategies
  - to: comparison-aggregation-logic
    relation: implements
    description: >-
      Comparison totals component implements both strategies' data-splitting
      logic
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
  - symbol: useSetReportTimeComparison
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts:L26-L94
  - symbol: useReportTimeCompareConnect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts:L96-L250
  - symbol: useTimeCompareTimeDescription
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts:L252-L289
---

<!-- context:generated:start -->

## Summary

Two distinct strategies for comparing activity across time: 'beforeAfter' uses a date threshold to split all data buckets into pre/post groups (baseline start auto-calculated from comparison start minus duration), while 'periodComparison' pairs timeline buckets sequentially between baseline and comparison periods (requiring equal paired counts). Design choice of averaging min/max estimate bounds as midpoint for aggregation ensures consistency with graph rendering.

## Related

- implements [[activity-report-ui-components]] — ReportActivityPeriodComparison and ReportActivityGraphSelector enforce and switch between these two comparison strategies
- implements [[comparison-aggregation-logic]] — Comparison totals component implements both strategies' data-splitting logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
