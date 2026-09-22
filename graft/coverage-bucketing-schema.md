---
name: Coverage Bucketing Schema
slug: coverage-bucketing-schema
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.utils.ts
    hash: 9bff4feb9a4c3b4a7e5ad9ba68529138ba59325a88476523013f58910bd6ca2d
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx
    hash: 301efef7894b2d65f8dde77881027ec3f5045493f768721c1cde249d2bbac9cb
sources_digest: ba60d062b9e60b2ba0f979b8df0ce69f1fd1d0a8a9fe4f4df0adf82f285bbfbe
links:
  - to: vessel-group-report-insights-system
    relation: implements
    description: >-
      VGRInsightCoverageGraph assumes vessels have non-null coverageBucket
      property and groups/sorts by bucket for bar chart rendering; data parsing
      returns gracefully for missing/empty input
generator:
  version: 1
covers:
  - symbol: CustomTick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L18-L28
  - symbol: getDataByCoverage
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L30-L33
  - symbol: parseCoverageGraphAggregatedData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L35-L43
  - symbol: parseCoverageGraphIndividualData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L45-L55
  - symbol: VesselGroupReportInsightCoverageGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L57-L93
  - symbol: parseCoverageGraphValueBucket
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.utils.ts:L14-L22
---

<!-- context:generated:start -->

## Summary

Classifies vessel coverage percentages into six ordered ranges: empty (−1), ≤20%, 21–40%, 41–60%, 61–80%, ≥81% via COVERAGE_GRAPH_BUCKETS mapping and parseCoverageGraphValueBucket linear search. Handles missing data via EMPTY_FIELD_PLACEHOLDER; enables UI to display aggregated coverage statistics in consistent categorical bins for grouping and visualization.

## Related

- implements [[vessel-group-report-insights-system]] — VGRInsightCoverageGraph assumes vessels have non-null coverageBucket property and groups/sorts by bucket for bar chart rendering; data parsing returns gracefully for missing/empty input

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
