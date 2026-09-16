---
name: Analytics and Navigation
slug: analytics-and-navigation
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparison.tsx
    hash: 51f759aec9b7cd246c362feb4f51fd2c220227dbf3c1fede9fcc910b5ebfb3c9
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityGraphSelector.tsx
    hash: eb706e1f1a76e36bf2bca47b9baa56fdf3e076730e8ed717a04415a149040f9b
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx
    hash: be07c27f4c80b55d8e10ec2bde486498b92c3805fd97057d57094d67ab1b67d2
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivitySubsectionSelector.tsx
    hash: 35426b1dd6f5efa4956f423d55356cae10e1890d398fae2205e8ea3223719e67
  - path: apps/platform/features/_reports/tabs/events/EventReportPorts.tsx
    hash: 06cb3dfa2faa52b69eb5e384aa3c16343c3997a2ae8d71b08b0cb9fe3590c510
sources_digest: efb879c605fbec40ef5415c9098c1690992a2863d6b3ae4767d86fa4c0a84a86
links:
  - to: activity-report-ui-components
    relation: implements
    description: >-
      UI components integrate trackEvent and useReplaceQueryParams for analytics
      and URL sync
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
  - symbol: EventReportPorts
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L28-L216'
  - symbol: onPrevPageClick
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L57-L59'
  - symbol: onNextPageClick
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L60-L62'
  - symbol: onTogglePortFilter
    kind: function
    at: 'apps/platform/features/_reports/tabs/events/EventReportPorts.tsx:L72-L92'
---

<!-- context:generated:start -->

## Summary

Cross-cutting analytics and navigation integration throughout reports. trackEvent logs user interactions (graph type selection, dataset comparison, parameter changes) with contextual metadata (region name, data sources). useFitAreaInViewport adjusts map viewport on dataset selection or comparison mode changes. Redux navigation actions (from nav.actions) handle tab-level state resets.

## Related

- implements [[activity-report-ui-components]] — UI components integrate trackEvent and useReplaceQueryParams for analytics and URL sync

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
