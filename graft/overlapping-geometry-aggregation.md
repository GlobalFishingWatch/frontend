---
name: Overlapping Geometry Aggregation
slug: overlapping-geometry-aggregation
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts
    hash: cc8483b5ce83ec7853defa34d38799db9d8a8303bf2f95f0b5e0551f28998b43
sources_digest: ada3f83be045679b14ca3df307b822b3b1234b8066086eef4733233a7919142e
links:
  - to: time-series-data-transformation
    relation: implements
    description: >-
      fourwingsFeaturesToTimeseries and getFourwingsTimeseriesStats implement
      both aggregation strategies
generator:
  version: 1
covers:
  - symbol: FourwingsFeaturesToTimeseriesParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L32-L41
  - symbol: fourwingsFeaturesToTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L42-L138
  - symbol: GetFourwingsTimeseriesParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L140-L143
  - symbol: getFourwingsTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L144-L168
  - symbol: getFourwingsTimeseriesStats
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L170-L236
  - symbol: formatDateTicks
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L238-L241
  - symbol: formatEvolutionData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L243-L353
  - symbol: processTimeseries
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts:L296-L302
---

<!-- context:generated:start -->

## Summary

Critical design decision for timeseries aggregation from overlapping polygons: 'avg' aggregation treats min/max ranges as estimate bounds and uses midpoint for aggregation, requiring single-pass processing since averaging is non-additive. 'sum' aggregation processes only overlapping cells and adds to pre-computed contained values, optimizing performance. This ensures timeseries data aggregation matches how graphs plot individual data points.

## Related

- implements [[time-series-data-transformation]] — fourwingsFeaturesToTimeseries and getFourwingsTimeseriesStats implement both aggregation strategies

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
