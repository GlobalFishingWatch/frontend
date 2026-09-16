---
name: Report dataview categorization and filtering
slug: report-dataview-categorization-and-filtering
type: system
sources:
  - path: apps/platform/features/_reports/report-dataview-category.utils.ts
    hash: fa0b6e5cfe8ce75ecb7ad2706d7b975d1100fda4999855ec14686085ea6f2a12
sources_digest: 074b7438dd38f91a0f00f1635abc35f560c8d7d49372a0d09f02d0815ed368e0
links:
  - to: area-reports-system-core-logic-selectors
    relation: implements
    description: >-
      Provides category and support predicates consumed by
      area-reports.selectors for dataview filtering
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: implements
    description: >-
      Used by workspace selectors to determine workspace-compatible dataview
      categories
generator:
  version: 1
covers:
  - symbol: isPointsDataviewReportSupported
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-category.utils.ts:L21-L23'
  - symbol: isPolygonsDataviewReportSupported
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-category.utils.ts:L25-L35'
  - symbol: isContextDataviewReportSupported
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-category.utils.ts:L37-L39'
  - symbol: isUserHeatmapDataviewReportSupported
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-category.utils.ts:L41-L47'
  - symbol: getReportCategoryFromDataview
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-category.utils.ts:L49-L62'
  - symbol: getReportSubCategoryFromDataview
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-category.utils.ts:L64-L77'
  - symbol: isSupportedReportDataview
    kind: function
    at: >-
      apps/platform/features/_reports/report-dataview-category.utils.ts:L109-L117
  - symbol: isSupportedComparisonDataview
    kind: function
    at: >-
      apps/platform/features/_reports/report-dataview-category.utils.ts:L119-L128
---

<!-- context:generated:start -->

## Summary

Lightweight predicates and mappers for classifying dataviews into report-compatible categories, extracted into dependency-free files to prevent tree-shaking issues. Exports isPointsDataviewReportSupported, isPolygonsDataviewReportSupported, isContextDataviewReportSupported, isUserHeatmapDataviewReportSupported, getReportCategoryFromDataview, isSupportedReportDataview, and related validation functions using configuration allowlists (SUPPORTED_REPORT_CATEGORIES, SUPPORTED_REPORT_TYPES).

## Related

- implements [[area-reports-system-core-logic-selectors]] — Provides category and support predicates consumed by area-reports.selectors for dataview filtering
- implements [[workspace-state-orchestration-redux-slice-selectors]] — Used by workspace selectors to determine workspace-compatible dataview categories

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
