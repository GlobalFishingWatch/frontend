---
name: Bundle size optimization through module isolation
slug: bundle-size-optimization-through-module-isolation
type: concept
sources:
  - path: apps/platform/features/_map/workspace/workspace.slice.ts
    hash: 3bbdc0e28b7f974553bbc9bf16f4a2235521b290b75aa59201d0bca580b780aa
  - path: apps/platform/features/_map/workspaces-list/workspaces-list.config.ts
    hash: 3120842e2893efdba2137f8d77ebdbc287d7e28b10b634e9c4f7ec538be4dbb2
  - path: >-
      apps/platform/features/_reports/report-area/area-reports.buffer.selectors.ts
    hash: f9ab53669b8403ef18ec533e10397625c28595bad856767e013ec88139711fe0
  - path: apps/platform/features/_reports/report-area/area-reports.selectors.ts
    hash: 99ee343c7a353f7c24c3a615d048b0e4f459e7ef44b07e52406c8cc37a479df3
  - path: apps/platform/features/_reports/report-area/area-reports.utils.ts
    hash: bcb9374f504856975ff6f8d3c596e095528703a48e6ffce008b481cc1d3e45e2
  - path: apps/platform/features/_reports/report-dataview-category.utils.ts
    hash: fa0b6e5cfe8ce75ecb7ad2706d7b975d1100fda4999855ec14686085ea6f2a12
  - path: apps/platform/features/_reports/report-dataview-cleaners.ts
    hash: 3a866f62bc62e0c08e8ab9dd3bd384860d1a24c6295ef560330fa7565f519960
sources_digest: 8773c28f1ac0c3bdd9248cc2940ab569b74716b5a6ea61374792828b8bd330d5
links:
  - to: area-reports-system-core-logic-selectors
    relation: implements
    description: >-
      Buffer selectors and utilities are split to prevent heavy dependencies
      from polluting selector modules
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: implements
    description: >-
      Workspace slice uses lazy-loading and module splitting to minimize bundle
      impact
generator:
  version: 1
covers:
  - symbol: LastWorkspaceVisited
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L76-L78'
  - symbol: getPersistedHistoryNavigation
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L82-L92'
  - symbol: persistHistoryNavigation
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L94-L103'
  - symbol: WorkspaceSliceState
    kind: interface
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L105-L116'
  - symbol: RejectedActionPayload
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L130-L133'
  - symbol: getDefaultWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L148-L161'
  - symbol: fetchWorkspaceByIdSafe
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L163-L172'
  - symbol: FetchWorkspacesThunkParams
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L174-L179'
  - symbol: matchUserDataset
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L348-L348'
  - symbol: SaveWorkspaceThunkProperties
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L492-L500'
  - symbol: saveWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L522-L553'
  - symbol: UpdateWorkspaceThunkRejectError
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L560-L562'
  - symbol: UpdateCurrentWorkspaceThunkParams
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.slice.ts:L564-L568'
  - symbol: HighlightedWorkspaceCategory
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.config.ts:L21-L21
  - symbol: HighlightedWorkspace
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.config.ts:L23-L37
  - symbol: HighlightedWorkspaces
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.config.ts:L39-L42
  - symbol: ReportVesselWithMeta
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/area-reports.selectors.ts:L70-L79
  - symbol: ReportVesselWithDatasets
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/area-reports.selectors.ts:L81-L91
  - symbol: tickFormatter
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L55-L60'
  - symbol: formatDate
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L62-L82'
  - symbol: formatTooltipValue
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L84-L91'
  - symbol: BufferedAreaParams
    kind: type
    at: 'apps/platform/features/_reports/report-area/area-reports.utils.ts:L93-L99'
  - symbol: getBufferedFeature
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L102-L143
  - symbol: getBufferedArea
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L146-L168
  - symbol: getBufferedAreaBbox
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L170-L185
  - symbol: parseReportUrl
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L187-L196
  - symbol: normalizeVesselProperties
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L198-L213
  - symbol: getVesselsFiltered
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.utils.ts:L217-L277
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
  - symbol: cleanAggregateByPropertyDataviewFromReport
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-cleaners.ts:L14-L26'
  - symbol: cleanDatasetComparisonDataviewInstances
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-cleaners.ts:L28-L34'
---

<!-- context:generated:start -->

## Summary

Cross-cutting design pattern: heavyweight dependencies (Turf.js, match-sorter, deck-layers, simple-statistics) are isolated into feature-specific utility modules rather than imported at higher levels, preventing tree-shaking from forcing them into every page's entry chunk. Selectors and configuration modules are split strategically—area-reports.buffer.selectors separate from area-reports.selectors to avoid pulling deck-layers into MainNav; workspaces-list.config.ts isolated to avoid selector dependencies in global navigation; report-dataview-category.utils.ts dependency-free to avoid bloating all pages. Lazy-loading via import.meta.glob (getDefaultWorkspace, LIBRARY_LAYERS) defers module resolution until needed.

## Related

- implements [[area-reports-system-core-logic-selectors]] — Buffer selectors and utilities are split to prevent heavy dependencies from polluting selector modules
- implements [[workspace-state-orchestration-redux-slice-selectors]] — Workspace slice uses lazy-loading and module splitting to minimize bundle impact

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
