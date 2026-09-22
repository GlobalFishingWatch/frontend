---
name: User data and permissions
slug: user-data-and-permissions
type: concept
sources:
  - path: apps/platform/features/_map/workspace/workspace.selectors.ts
    hash: 764cd830fe761c9b6561437cd988064c9d2ca667fec9a64ee15f92f8731272a9
  - path: apps/platform/features/_map/workspace/workspace.slice.ts
    hash: 3bbdc0e28b7f974553bbc9bf16f4a2235521b290b75aa59201d0bca580b780aa
  - path: apps/platform/features/_map/workspace/WorkspaceLoginError.tsx
    hash: efeedcdee1dfac160dcdf4df1f7821488d4f8a12415279161cf80b02c070956f
  - path: apps/platform/features/_map/workspaces-list/workspaces-list.selectors.ts
    hash: 856c21075bdb8a58a45b41b0cc8ac2ddcffe107728920a0ca61df7e338fb7636
sources_digest: 75b78fdc88a327e667e9e67518dfc862c8731f2f510f41e7c90500f2300a850a
links:
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: implements
    description: User permissions gate workspace fetch scope and dataview injection
generator:
  version: 1
covers:
  - symbol: WorkspaceLoginErrorProps
    kind: interface
    at: 'apps/platform/features/_map/workspace/WorkspaceLoginError.tsx:L18-L23'
  - symbol: WorkspaceLoginError
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspaceLoginError.tsx:L25-L71'
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

Cross-cutting pattern: user authentication, language preference, and workspace access permissions gate dataview injection, workspace visibility filtering, and UI feature availability. Guest users see different login flows; private workspaces require explicit access grants; staff and private-group-specific dataviews are conditionally injected based on user roles. Workspace fetch scope is restricted by API client authentication state.

## Related

- implements [[workspace-state-orchestration-redux-slice-selectors]] — User permissions gate workspace fetch scope and dataview injection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
