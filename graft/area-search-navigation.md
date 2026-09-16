---
name: Area Search & Navigation
slug: area-search-navigation
type: system
sources:
  - path: apps/platform/features/_reports/shared/area-search/area-report.hooks.ts
    hash: 790b51980c0af07644fce1009b88975e3b2685da6868f4b2d550f0fcd6c37a74
  - path: apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx
    hash: 5a041bb51614838b5b90009e8eaf9baec72483e0aba0b69e1f603643b8e1bbe3
sources_digest: d1715f2bbab222b3fd3874d69464313d9efd1e97349c6bed14026dacc7c55704
links:
  - to: report-state-configuration
    relation: uses
    description: >-
      Merges newly activated dataviews into query string to control map layer
      visibility
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Resolves workspace context and dataview configuration for area-specific
      navigation
generator:
  version: 1
covers:
  - symbol: getItemLabel
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L22-L28
  - symbol: AreaReportSearch
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L30-L143
  - symbol: updateMatchingAreas
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L39-L50
  - symbol: onInputChange
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L52-L60
  - symbol: onSelectResult
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L62-L75
  - symbol: onInputBlur
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L87-L93
  - symbol: handleKeyDown
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx:L97-L105
  - symbol: mergeDataviewInstances
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/area-report.hooks.ts:L19-L33
  - symbol: useNavigateToAreaReport
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/area-report.hooks.ts:L35-L91
---

<!-- context:generated:start -->

## Summary

Provides searchable interface for discovering ocean areas (EEZ, FAO, RFMO) and generating reports scoped to them. Routes to port reports or workspace reports based on area type and coordinates dataview visibility in URL state.

## Related

- uses [[report-state-configuration]] — Merges newly activated dataviews into query string to control map layer visibility
- depends on [[workspace-routing-state]] — Resolves workspace context and dataview configuration for area-specific navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
