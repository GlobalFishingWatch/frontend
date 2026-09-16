---
name: Point Aggregation and Filtering
slug: point-aggregation-and-filtering
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx
    hash: 310c7dd5a77101ec492366da3b7cb1c43d6453c2583a67253665a87b9b552dc0
  - path: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts
    hash: 94ac0b2465c4c6eceaadf829cbee7cb456ef5a859650bb3cecb615cbe5dd6b29
sources_digest: 0c717cbddaebcfe8b216edf3c7cd33d40e0d231705e9171a58bceac00921b861
links:
  - to: report-others-tab-system
    relation: implements
    description: >-
      ReportPointsGraph renders aggregation property selector and delegates
      time-series rendering to ReportActivityEvolution; stat extraction via
      useTimeseriesStats
generator:
  version: 1
covers:
  - symbol: ReportPointsGraph
    kind: function
    at: 'apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx:L29-L157'
  - symbol: onSelectAggregatedProperty
    kind: function
    at: 'apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx:L65-L70'
  - symbol: onClearSelection
    kind: function
    at: 'apps/platform/features/_reports/tabs/others/ReportPointsGraph.tsx:L71-L73'
  - symbol: PointsFeaturesToTimeseriesParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L18-L26
  - symbol: pointsFeaturesToTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L28-L71
  - symbol: GetPointsTimeseriesParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L73-L76
  - symbol: getPointsTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L78-L108
  - symbol: getPointsTimeseriesStats
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts:L110-L146
---

<!-- context:generated:start -->

## Summary

Point features are aggregated into timeseries via pointsFeaturesToTimeseries (extracts temporal info using getGraphDataFromPoints and normalizes to date-indexed entries) and getPointsTimeseriesStats (computes totals/per-sublayer counts for summaries). Filtering respects time windows via isFeatureInRange; requires min/max time properties from layer config. Currently treats min/max identically (both set to same values array), suggesting point aggregation rather than range data.

## Related

- implements [[report-others-tab-system]] — ReportPointsGraph renders aggregation property selector and delegates time-series rendering to ReportActivityEvolution; stat extraction via useTimeseriesStats

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
