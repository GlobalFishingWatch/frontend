---
name: Environment Report UI
slug: environment-report-ui
type: system
sources:
  - path: apps/platform/features/_reports/tabs/environment/ReportEnvironment.tsx
    hash: 28fef3f17922b236d975ff7019a121e2fb722f5c3393d9b786639c3274adb757
  - path: >-
      apps/platform/features/_reports/tabs/environment/ReportEnvironmentGraphSelector.tsx
    hash: c40f70b76c24994abbee7894e1cd6ee19077dfd5f55fbbc9e371ba327b3fd560
sources_digest: 69b2c10ca552a6fe3664cfd62be5815f34e4ff652be3ac6b54e17d5fbcf0136d
links:
  - to: environment-graph-rendering
    relation: uses
    description: >-
      Delegates to ReportEnvironmentGraph, ReportPolygonsGraph,
      ReportVectorGraphTooltip, and Migramar components based on dataview types
  - to: time-series-data-transformation
    relation: depends_on
    description: >-
      Uses useComputeReportTimeSeries and useReportFilteredTimeSeries hooks to
      process environmental data
generator:
  version: 1
covers:
  - symbol: ReportEnvironment
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/ReportEnvironment.tsx:L41-L135
  - symbol: ReportEnvironmentGraphSelector
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/ReportEnvironmentGraphSelector.tsx:L22-L83
  - symbol: onSelect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/ReportEnvironmentGraphSelector.tsx:L42-L67
---

<!-- context:generated:start -->

## Summary

React components orchestrating environmental data visualization in reports, supporting heatmaps, vector fields (wind/current), polygons, and Migramar biodiversity indicators. Components compose graph selectors, toggle between evolution and dataset comparison modes, and integrate with layer library for adding new environmental layers.

## Related

- uses [[environment-graph-rendering]] — Delegates to ReportEnvironmentGraph, ReportPolygonsGraph, ReportVectorGraphTooltip, and Migramar components based on dataview types
- depends on [[time-series-data-transformation]] — Uses useComputeReportTimeSeries and useReportFilteredTimeSeries hooks to process environmental data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
