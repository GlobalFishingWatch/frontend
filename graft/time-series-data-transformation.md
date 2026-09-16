---
name: Time Series Data Transformation
slug: time-series-data-transformation
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts
    hash: cc8483b5ce83ec7853defa34d38799db9d8a8303bf2f95f0b5e0551f28998b43
sources_digest: ada3f83be045679b14ca3df307b822b3b1234b8066086eef4733233a7919142e
links:
  - to: activity-graph-rendering
    relation: produces
    description: >-
      Produces ReportGraphProps arrays consumed by graph components;
      formatEvolutionData fills gaps and formatDateTicks localizes ticks
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

Utility functions converting Fourwings geospatial heatmap data into time-series for activity reports, handling overlapping polygons via average or additive aggregation modes, filling temporal gaps with Luxon interval arithmetic, and localizing date formatting. Extracts chunk intervals and layer configuration from FourwingsLayer props and respects sublayer visibility filters.

## Related

- produces [[activity-graph-rendering]] — Produces ReportGraphProps arrays consumed by graph components; formatEvolutionData fills gaps and formatDateTicks localizes ticks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
