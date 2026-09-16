---
name: Activity Report UI Components
slug: activity-report-ui-components
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx
    hash: 51f759aec9b7cd246c362feb4f51fd2c220227dbf3c1fede9fcc910b5ebfb3c9
  - path: apps/platform/features/_reports/tabs/activity/ReportActivityGraph.tsx
    hash: 068d301298167028cdd8741bcdd663ef32d549ad5e179d90dafef3aeecbf48ab
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx
    hash: eb706e1f1a76e36bf2bca47b9baa56fdf3e076730e8ed717a04415a149040f9b
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx
    hash: be07c27f4c80b55d8e10ec2bde486498b92c3805fd97057d57094d67ab1b67d2
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivitySubsectionSelector.tsx
    hash: 35426b1dd6f5efa4956f423d55356cae10e1890d398fae2205e8ea3223719e67
sources_digest: a33f21edfd0ff5d6861e6afd5aaa6181fbf0854814746d158a098aa0e04b4f53
links:
  - to: activity-graph-rendering
    relation: uses
    description: >-
      UI components select and delegate to ReportActivityEvolution,
      ReportActivityBeforeAfterGraph, ReportActivityPeriodComparisonGraph, or
      ReportActivityDatasetComparisonGraph for actual visualization
  - to: activity-report-redux-state
    relation: depends_on
    description: >-
      All components read from Redux selectors (selectReportTimeComparison,
      selectReportActivityGraph, selectActiveReportDataviews) to access current
      report configuration and state
  - to: analytics-and-navigation
    relation: uses
    description: >-
      Components call trackEvent for analytics, useReplaceQueryParams to sync
      URL, and useFitAreaInViewport for viewport management
  - to: time-comparison-state-management
    relation: depends_on
    description: >-
      ReportActivityPeriodComparison and ReportActivityGraphSelector depend on
      useReportTimeCompareConnect and useSetReportTimeComparison hooks to manage
      and validate comparison configurations
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
  - symbol: ReportActivityProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraph.tsx:L44-L48
  - symbol: SharedGraphType
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraph.tsx:L57-L57
  - symbol: ReportActivity
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraph.tsx:L64-L191
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
  - symbol: ReportActivityPeriodComparison
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:L21-L173
  - symbol: trackAndChangeComparisonDate
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:L38-L51
  - symbol: trackAndChangeBaselineDate
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:L53-L66
  - symbol: trackAndChangeDuration
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:L68-L81
  - symbol: trackAndChangeDurationType
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx:L83-L96
  - symbol: ReportActivitySubsectionSelector
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivitySubsectionSelector.tsx:L34-L127
  - symbol: onSelectSubsection
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivitySubsectionSelector.tsx:L95-L111
---

<!-- context:generated:start -->

## Summary

React components orchestrating activity report visualization and configuration, including graph selection, time-period comparison interfaces, dataset comparison dropdowns, and subsection/metric selection. These components wire together Redux selectors, hooks for data computation, and UI controls to allow users to analyze fishing activity across time and geographies.

## Related

- uses [[activity-graph-rendering]] — UI components select and delegate to ReportActivityEvolution, ReportActivityBeforeAfterGraph, ReportActivityPeriodComparisonGraph, or ReportActivityDatasetComparisonGraph for actual visualization
- depends on [[activity-report-redux-state]] — All components read from Redux selectors (selectReportTimeComparison, selectReportActivityGraph, selectActiveReportDataviews) to access current report configuration and state
- uses [[analytics-and-navigation]] — Components call trackEvent for analytics, useReplaceQueryParams to sync URL, and useFitAreaInViewport for viewport management
- depends on [[time-comparison-state-management]] — ReportActivityPeriodComparison and ReportActivityGraphSelector depend on useReportTimeCompareConnect and useSetReportTimeComparison hooks to manage and validate comparison configurations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
