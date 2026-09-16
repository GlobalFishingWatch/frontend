---
name: Report State Configuration
slug: report-state-configuration
type: system
sources:
  - path: apps/platform/features/_reports/reports.config.selectors.ts
    hash: 25f63824ec13b62b69ed09f1babcffdefbd309c52c0748a81a542830975e13a3
  - path: apps/platform/features/_reports/reports.config.ts
    hash: 4c203f3fa30c4344219abbf7ed36200c2d37b27f5d21ec0b4784eb6c96a80d4b
  - path: apps/platform/features/_reports/reports.types.ts
    hash: 7b4671611fdb82218b3444789db4bad4a74e83e6ca96a9403ebad8546c6f8707
sources_digest: 5e4f885e9b82696b0f412c77823eaed4194433a129b171f9bb4ca01ff98f4ed0
links:
  - to: report-crud-operations
    relation: uses
    description: >-
      Provides type definitions and default state shape for persisting report
      configurations
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Reads location query and workspace state to resolve report configuration
      with cascading fallbacks
generator:
  version: 1
covers:
  - symbol: AreaReportProperty
    kind: type
    at: 'apps/platform/features/_reports/reports.config.selectors.ts:L9-L9'
  - symbol: selectReportStateProperty
    kind: function
    at: 'apps/platform/features/_reports/reports.config.selectors.ts:L10-L22'
  - symbol: ReportCategory
    kind: enum
    at: 'apps/platform/features/_reports/reports.types.ts:L21-L29'
  - symbol: ReportCategoryState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L30-L33'
  - symbol: ReportActivitySubCategory
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L45-L46'
  - symbol: ReportDetectionsSubCategory
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L47-L48'
  - symbol: ReportEventsSubCategory
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L49-L49'
  - symbol: ReportVesselsSubCategory
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L50-L50'
  - symbol: AnyReportSubCategory
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L52-L56'
  - symbol: ReportSubcategoryState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L58-L67'
  - symbol: AreaReportState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L70-L81'
  - symbol: PortsReportState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L84-L91'
  - symbol: ReportVesselOrderProperty
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L95-L95'
  - symbol: ReportVesselOrderDirection
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L97-L97'
  - symbol: ReportVesselGraph
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L98-L101'
  - symbol: ReportVesselsState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L105-L126'
  - symbol: ReportActivityGraph
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L128-L132'
  - symbol: ReportEventsGraph
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L135-L140'
  - symbol: ReportActivityTimeComparison
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L142-L147'
  - symbol: ReportComparisonDataviews
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L149-L152'
  - symbol: ReportActivityState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L154-L161'
  - symbol: ReportEventsState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L163-L172'
  - symbol: ReportState
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L174-L180'
  - symbol: ReportStateProperty
    kind: type
    at: 'apps/platform/features/_reports/reports.types.ts:L182-L182'
---

<!-- context:generated:start -->

## Summary

Centralizes report configuration state management via Redux selectors and defaults: maps URL query parameters and workspace state to report categories, subcategories, area bounds, vessel filters, and graph selections. Provides generic fallback strategy (URL > workspace > defaults) across ~20 selectors.

## Related

- uses [[report-crud-operations]] — Provides type definitions and default state shape for persisting report configurations
- depends on [[workspace-routing-state]] — Reads location query and workspace state to resolve report configuration with cascading fallbacks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
