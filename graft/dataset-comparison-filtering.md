---
name: Dataset Comparison Filtering
slug: dataset-comparison-filtering
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx
    hash: 51f759aec9b7cd246c362feb4f51fd2c220227dbf3c1fede9fcc910b5ebfb3c9
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx
    hash: da75ac418bc124a1dc54c1d279693673b51f7595357d1630cab1fde3ed45545a
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx
    hash: eb706e1f1a76e36bf2bca47b9baa56fdf3e076730e8ed717a04415a149040f9b
sources_digest: b4b0af09bc211b916c15aa105dd9e474ebefba4782e88af81234c71242d1dfcd
links:
  - to: activity-graph-rendering
    relation: uses
    description: >-
      ReportActivityDatasetComparisonGraph applies sublayer filtering and
      dual-axis rendering for comparison visualization
  - to: activity-report-ui-components
    relation: implements
    description: >-
      ReportActivityDatasetComparison and ReportActivityGraphSelector manage
      dataset comparison mode selection and filtering
generator:
  version: 1
covers:
  - symbol: createDatasetOption
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx:L27-L36
  - symbol: ReportActivityDatasetComparison
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx:L38-L182
  - symbol: onMainSelect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx:L124-L131
  - symbol: onCompareSelect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx:L133-L146
  - symbol: ReportActivityDatasetComparisonProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L28-L32
  - symbol: filterDataBySublayer
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L34-L65
  - symbol: findDataviewData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L67-L71
  - symbol: calculateXDomain
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L73-L83
  - symbol: calculateYAxisDomain
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L85-L100
  - symbol: ReportActivityDatasetComparisonGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L102-L283
  - symbol: isEvolutionOrDatasetComparison
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx:L28-L29
  - symbol: ReportActivityGraphSelectorProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx:L31-L33
  - symbol: ReportActivityGraphSelector
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx:L35-L131
  - symbol: onSelect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx:L78-L113
---

<!-- context:generated:start -->

## Summary

System for selecting and comparing two datasets within a single report. Filters eligible comparison layers by category matching, support validation (isSupportedComparisonDataview), and exclusion of the main dataset. Comparison dataview IDs use DATASET_COMPARISON_SUFFIX constant and require LAYER_LIBRARY_ID_SEPARATOR formatting when constructed. Color conflicts with main dataview are avoided. Switches between evolution and dataset comparison modes clear or preserve comparison-suffixed dataviews.

## Related

- uses [[activity-graph-rendering]] — ReportActivityDatasetComparisonGraph applies sublayer filtering and dual-axis rendering for comparison visualization
- implements [[activity-report-ui-components]] — ReportActivityDatasetComparison and ReportActivityGraphSelector manage dataset comparison mode selection and filtering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
