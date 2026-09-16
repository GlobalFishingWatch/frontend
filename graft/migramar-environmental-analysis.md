---
name: Migramar Environmental Analysis
slug: migramar-environmental-analysis
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/environment/migramar/reportEnvironmentMigramar.hooks.ts
    hash: 841e4ac3059e2c3beb4afdb8937ded574fc45056f1d481eaa94b6d75bed3200d
  - path: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramar.tsx
    hash: f2d9d017bac99b80f79767f300dcf6e58fb132bdc01720dd95d2eb346579f358
  - path: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx
    hash: d91f3d87044026630e57496e8174f9c48d9b688bffa8fedcb64f0c024464a16c
sources_digest: f55aa44a8c42fe104abbf673c600017d06c70e35b9bff8f5627b892bf7ef0b7e
links:
  - to: environment-report-ui
    relation: part_of
    description: >-
      Migramar rendering is integrated into the broader environment report tab
      via ReportEnvironment component
generator:
  version: 1
covers:
  - symbol: ReportEnvironmentMigramar
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramar.tsx:L15-L85
  - symbol: getCategory
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx:L27-L38
  - symbol: parseBaselineYears
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx:L40-L47
  - symbol: getYearsFromRow
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx:L49-L54
  - symbol: ChartPoint
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx:L56-L62
  - symbol: CustomDot
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx:L64-L76
  - symbol: CustomTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx:L78-L103
  - symbol: ReportEnvironmentMigramarGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx:L105-L223
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

Components and hooks for visualizing Migramar ocean biodiversity data within environmental reports. Fetches species and indicator metadata from `/api/migramar/options` and area-specific rows from `/api/migramar/{areaId}`, manages species/indicator selection with dynamic filtering based on available year data, and renders line charts with category-based coloring, GAMM trend overlays, and baseline period highlights.

## Related

- part of [[environment-report-ui]] — Migramar rendering is integrated into the broader environment report tab via ReportEnvironment component

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
