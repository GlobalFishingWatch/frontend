---
name: Workspace state orchestration (Redux slice & selectors)
slug: workspace-state-orchestration-redux-slice-selectors
type: system
sources:
  - path: apps/platform/features/_map/workspace/workspace.selectors.ts
    hash: 764cd830fe761c9b6561437cd988064c9d2ca667fec9a64ee15f92f8731272a9
  - path: apps/platform/features/_map/workspace/workspace.slice.ts
    hash: 3bbdc0e28b7f974553bbc9bf16f4a2235521b290b75aa59201d0bca580b780aa
sources_digest: 103ba86297cf8ac18e841982d3bfb1ef1f5fd1ef8eca6bf7cfa8aa0dff19dabd
links:
  - to: dataview-and-dataset-loading-integration
    relation: depends_on
    description: >-
      Conditionally dispatches fetchDataviewsByIdsThunk and
      fetchDatasetsByIdsThunk based on permissions; lazy-loads related thunks
  - to: user-data-and-permissions
    relation: depends_on
    description: >-
      Uses user selectors to gate dataview injection and determine API fetch
      scope
  - to: workspace-user-interface-components
    relation: implements
    description: >-
      Selectors and thunks provide state and actions consumed by Workspace.tsx
      and related UI components
  - to: workspace-utilities-and-validation
    relation: uses
    description: >-
      Depends on parseUpsertWorkspace, isPrivateWorkspaceNotAllowed, and
      report-cleaning utilities for data transformation
generator:
  version: 1
covers:
  - symbol: selectWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L47-L47'
  - symbol: selectWorkspaceReportId
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L48-L48'
  - symbol: selectWorkspacePassword
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L49-L49'
  - symbol: selectSuggestWorkspaceSave
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L50-L50'
  - symbol: selectWorkspaceError
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L51-L51'
  - symbol: selectWorkspaceStatus
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L52-L52'
  - symbol: selectWorkspaceRefreshStatus
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L53-L53'
  - symbol: selectIsWorkspaceRefreshing
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L54-L55'
  - symbol: selectWorkspaceHistoryNavigation
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L56-L57'
  - symbol: selectWorkspaceCustomStatus
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L58-L58'
  - symbol: isWorkspacePasswordProtected
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L144-L153'
  - symbol: WorkspaceProperty
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L194-L194'
  - symbol: selectWorkspaceStateProperty
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L201-L213'
  - symbol: WorkspaceFetchParams
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L237-L237'
  - symbol: getDefaultWorkspaceFetchParams
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L239-L246'
  - symbol: getReportWorkspaceFetchNeeded
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L248-L257'
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
---

<!-- context:generated:start -->

## Summary

Central Redux layer managing workspace data lifecycle—loading, saving, updating—from the GFW API, enriching with dataviews/datasets, handling password protection, and providing memoized selectors for workspace metadata, viewport, time ranges, and nested state properties. Uses tiered fallback logic (URL → workspace state → user settings → defaults) to resolve configuration; lazy-loads heavy dependencies (LIBRARY_LAYERS, datasets.utils) to minimize bundle size.

## Related

- depends on [[dataview-and-dataset-loading-integration]] — Conditionally dispatches fetchDataviewsByIdsThunk and fetchDatasetsByIdsThunk based on permissions; lazy-loads related thunks
- depends on [[user-data-and-permissions]] — Uses user selectors to gate dataview injection and determine API fetch scope
- implements [[workspace-user-interface-components]] — Selectors and thunks provide state and actions consumed by Workspace.tsx and related UI components
- uses [[workspace-utilities-and-validation]] — Depends on parseUpsertWorkspace, isPrivateWorkspaceNotAllowed, and report-cleaning utilities for data transformation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
