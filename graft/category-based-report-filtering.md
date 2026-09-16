---
name: Category-Based Report Filtering
slug: category-based-report-filtering
type: concept
sources:
  - path: apps/platform/features/_reports/shared/summary/report-summary.hooks.ts
    hash: c512b2bb1dc65e37dd81c08899524cfed3cfe0f465de7f902eca1ddfd8441e0a
  - path: apps/platform/features/_reports/shared/summary/ReportSummary.tsx
    hash: 4b42c4265f94e82cc78b571e9d2e1d7494decb8ceb28aeacac131d7471c9c0ca
  - path: apps/platform/features/_reports/shared/summary/ReportSummaryActivity.tsx
    hash: 94279b321031d4416cc18994670aa223789282c61dfa10bd79d306c60b3b0bfa
  - path: apps/platform/features/_reports/shared/summary/ReportSummaryEvents.tsx
    hash: 70073d07fe8713b8c265b82bc25f93db1e034219f132be611d50aa4bd1f28bcf
  - path: apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts
    hash: 68dd68e5e4565e310da86cbe5c4e9da4cd40888545a7854d117056a8842bcc69
sources_digest: 8779d6b9cd0bf4851368bcf039da34300dc7fdb0ef559b75858cdcb9ac28be7f
links:
  - to: report-summary
    relation: implements
    description: >-
      ReportSummary uses selectReportCategory to conditionally render
      ReportSummaryActivity, ReportSummaryEvents, or fallback; each handles
      their category's data structure and constraints
  - to: report-vessel-data-pipeline
    relation: implements
    description: >-
      selectReportVessels branches vessel transformation based on report
      category with different field extraction paths for identity-based vs. flat
      vessel structures
generator:
  version: 1
covers:
  - symbol: ReportSummaryProps
    kind: type
    at: 'apps/platform/features/_reports/shared/summary/ReportSummary.tsx:L27-L31'
  - symbol: ReportSummary
    kind: function
    at: 'apps/platform/features/_reports/shared/summary/ReportSummary.tsx:L33-L99'
  - symbol: ReportSummaryActivity
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryActivity.tsx:L45-L206
  - symbol: ReportSummaryEvents
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryEvents.tsx:L26-L105
  - symbol: getHasDataviewSchemaFilters
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.hooks.ts:L12-L26
  - symbol: useGetHasDataviewSchemaFilters
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.hooks.ts:L28-L41
  - symbol: getVesselSource
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts:L50-L60
  - symbol: VesselGroupVessel
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts:L62-L65
  - symbol: getVesselDatasetsWithoutEventsRelated
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts:L368-L385
---

<!-- context:generated:start -->

## Summary

A branching architecture where vessel data transformation and summary content differ substantially based on report category (Activity, Detections, VesselGroup, Events). Activity/Detections use flat ReportVesselWithDatasets structures while Events/VesselGroups extract data from identity objects; filter availability differs (vessel-group filters are excluded in vessel-group contexts), and summary rendering selects different i18n templates and Redux selectors per category.

## Related

- implements [[report-summary]] — ReportSummary uses selectReportCategory to conditionally render ReportSummaryActivity, ReportSummaryEvents, or fallback; each handles their category's data structure and constraints
- implements [[report-vessel-data-pipeline]] — selectReportVessels branches vessel transformation based on report category with different field extraction paths for identity-based vs. flat vessel structures

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
