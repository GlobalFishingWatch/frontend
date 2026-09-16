---
name: Internationalization (i18n) and Formatting
slug: internationalization-i18n-and-formatting
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx
    hash: 6bbc12b58c5da999a7df57ff8a47de12cfd48bf1ddac0b51199558eefb4ec2da
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx
    hash: be07c27f4c80b55d8e10ec2bde486498b92c3805fd97057d57094d67ab1b67d2
  - path: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts
    hash: cc8483b5ce83ec7853defa34d38799db9d8a8303bf2f95f0b5e0551f28998b43
  - path: apps/platform/features/_reports/tabs/activity/reports-activity.utils.ts
    hash: 321e013bb48e76494c49f19386d43f61098ff36bc78707b9e747254fd8a7b7d3
  - path: >-
      apps/platform/features/_reports/tabs/environment/migramar/reportEnvironmentMigramar.hooks.ts
    hash: 841e4ac3059e2c3beb4afdb8937ded574fc45056f1d481eaa94b6d75bed3200d
sources_digest: 78cac41601b54e0127829db0bc9a9c05069224b0021cc94aae22de0af8711e0b
links:
  - to: activity-graph-rendering
    relation: implements
    description: Graph components format dates and numbers via i18n utilities
  - to: activity-report-ui-components
    relation: implements
    description: UI components use i18n utilities for labels and useTranslation hook
generator:
  version: 1
covers:
  - symbol: ComparisonGraph
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx:L16-L16
  - symbol: bucketAvg
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx:L19-L19
  - symbol: ReportActivityComparisonTotals
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityComparisonTotals.tsx:L21-L125
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
  - symbol: getReportSubCategoryLabel
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.utils.ts:L6-L24
  - symbol: hasYearData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/reportEnvironmentMigramar.hooks.ts:L12-L19
  - symbol: useMigramar
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/reportEnvironmentMigramar.hooks.ts:L21-L119
  - symbol: selectSpecies
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/reportEnvironmentMigramar.hooks.ts:L104-L107
---

<!-- context:generated:start -->

## Summary

Reports system uses react-i18next for multilingual labels across all components, with specialized formatters for numbers (formatI18nNumber), dates (formatI18nDate, formatDateTicks), and subsection labels (getReportSubCategoryLabel). Tooltip values and comparison metrics use formatTooltipValue and I18nNumber components. Migramar component localizes species and indicator names between English and Spanish. Design allows translation key injection via optional TFunction parameter for testing.

## Related

- implements [[activity-graph-rendering]] — Graph components format dates and numbers via i18n utilities
- implements [[activity-report-ui-components]] — UI components use i18n utilities for labels and useTranslation hook

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
