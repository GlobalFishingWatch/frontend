---
name: Dataview and dataset loading integration
slug: dataview-and-dataset-loading-integration
type: concept
sources:
  - path: apps/platform/features/_map/workspace/workspace.slice.ts
    hash: 3bbdc0e28b7f974553bbc9bf16f4a2235521b290b75aa59201d0bca580b780aa
  - path: apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx
    hash: 1e44835831d1c089c147ae90891d9d885b66c87349d1a50a6f75b03fee78b8ca
  - path: apps/platform/features/_reports/report-area/area-reports.selectors.ts
    hash: 99ee343c7a353f7c24c3a615d048b0e4f459e7ef44b07e52406c8cc37a479df3
  - path: apps/platform/features/_reports/report-port/ports-report.selectors.ts
    hash: 124f00d25494f8d0cc6a943405d68d5173025e7a3367732588a07f58809a32bb
sources_digest: fdbdb92552fddb9da4d9182469ae30886d490aedd13879c46fb3eb87a3206e60
links:
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: implements
    description: >-
      Workspace slice conditionally dispatches dataview/dataset fetch thunks;
      selectors provide resolved instances
  - to: workspaces-list-ui-components
    relation: implements
    description: >-
      WorkspaceWizard and WorkspacesList dispatch dataview/dataset fetches
      before navigation
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
  - symbol: getItemLabel
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L54-L59'
  - symbol: WorkspaceWizard
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L61-L274'
  - symbol: updateMatchingAreas
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L73-L85'
  - symbol: onInputChange
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L87-L96'
  - symbol: onSelectResult
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L98-L106'
  - symbol: onSearchClick
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L108-L115'
  - symbol: onHighlightedIndexChange
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L117-L123'
  - symbol: fetchMarineManagerData
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L126-L135'
  - symbol: onInputBlur
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L149-L154'
  - symbol: ReportVesselWithMeta
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/area-reports.selectors.ts:L70-L79
  - symbol: ReportVesselWithDatasets
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/area-reports.selectors.ts:L81-L91
---

<!-- context:generated:start -->

## Summary

Cross-cutting pattern: dataview and dataset IDs are fetched lazily and conditionally based on workspace context and user permissions. Workspaces may auto-inject track datasets for vessel dataviews, GFW-staff-only or private-group-specific dataviews, and library layers via lazy-loaded modules (LIBRARY_LAYERS, datasets.utils). Dataview instances are resolved to include layer configuration and dataset metadata before rendering, and filtering by report category support happens at selector level.

## Related

- implements [[workspace-state-orchestration-redux-slice-selectors]] — Workspace slice conditionally dispatches dataview/dataset fetch thunks; selectors provide resolved instances
- implements [[workspaces-list-ui-components]] — WorkspaceWizard and WorkspacesList dispatch dataview/dataset fetches before navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
