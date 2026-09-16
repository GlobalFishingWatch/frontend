---
name: Data Aggregation with Others Bucketing
slug: data-aggregation-with-others-bucketing
type: concept
sources:
  - path: apps/platform/features/_reports/shared/utils/reports.utils.ts
    hash: 6e3febea373b092970ea9d89c47cb7ecd0de02498a4eab6c692da2c9af5bae2b
sources_digest: 6f240df5e6272bd5f4d5f7af3f2c6f7aa8657f36d5e2bee0c72eed805ddd8795
links:
  - to: report-visualization-components
    relation: produces
    description: >-
      Emits aggregated bar chart data consumed by ReportVesselsGraph and
      ReportBarTooltip which expands 'Others' category up to MAX_CATEGORIES in
      tooltips
generator:
  version: 1
covers:
  - symbol: VesselVisualizationData
    kind: type
    at: 'apps/platform/features/_reports/shared/utils/reports.utils.ts:L28-L31'
  - symbol: getAggregatedDataWithOthers
    kind: function
    at: 'apps/platform/features/_reports/shared/utils/reports.utils.ts:L35-L63'
  - symbol: getVesselAggregatedGroupedData
    kind: function
    at: 'apps/platform/features/_reports/shared/utils/reports.utils.ts:L65-L135'
  - symbol: getVesselIndividualGroupedData
    kind: function
    at: 'apps/platform/features/_reports/shared/utils/reports.utils.ts:L137-L232'
  - symbol: isTimeComparisonGraph
    kind: function
    at: 'apps/platform/features/_reports/shared/utils/reports.utils.ts:L239-L241'
---

<!-- context:generated:start -->

## Summary

A utility pattern (getAggregatedDataWithOthers, getVesselAggregatedGroupedData) that transforms high-cardinality categorical data into bounded visualizations by capping results at MAX_CATEGORIES and binning overflow items into an 'Others' category with detail tracking. Handles vessel-property grouping (by flag, vesselType, geartype, source), normalizes 'null' and 'other' values as equivalent, and sorts by aggregate value before bucketing.

## Related

- produces [[report-visualization-components]] — Emits aggregated bar chart data consumed by ReportVesselsGraph and ReportBarTooltip which expands 'Others' category up to MAX_CATEGORIES in tooltips

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
