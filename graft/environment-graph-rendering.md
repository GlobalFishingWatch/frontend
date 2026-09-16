---
name: Environment Graph Rendering
slug: environment-graph-rendering
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/environment/ReportEnvironmentGraph.tsx
    hash: b5d744889073b7e7ef4c88c7e2590edb6687fd2bcec1d0a562c5f00e74887e01
  - path: >-
      apps/platform/features/_reports/tabs/environment/ReportVectorGraphTooltip.tsx
    hash: 5e8ce3a07d28a84ca0efc8dc44f37bf868b78609efa98d5263f7dc86f187eec0
sources_digest: 325d4c68f03a6838e70881c571c45d13de11bf478aa85e60347dc40e59a19314
links:
  - to: time-series-data-transformation
    relation: uses
    description: >-
      Calls useComputeReportTimeSeries and useTimeseriesStats to aggregate
      environmental timeseries and compute statistics
generator:
  version: 1
covers:
  - symbol: ReportEnvironmentGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/ReportEnvironmentGraph.tsx:L41-L170
  - symbol: TooltipData
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/environment/ReportVectorGraphTooltip.tsx:L21-L27
  - symbol: metersPerSecondToKnots
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/ReportVectorGraphTooltip.tsx:L36-L38
  - symbol: ReportVectorGraphTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/ReportVectorGraphTooltip.tsx:L40-L269
---

<!-- context:generated:start -->

## Summary

Recharts-based visualizations for environmental data (heatmaps, vectors, polygons) with conditional graph selection based on data availability and error states. Computes statistical summaries (min, mean, max), applies dataset-specific aggregation modes, handles time interval selection, and renders appropriate disclaimers for dynamic/static layers and out-of-range data.

## Related

- uses [[time-series-data-transformation]] — Calls useComputeReportTimeSeries and useTimeseriesStats to aggregate environmental timeseries and compute statistics

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
