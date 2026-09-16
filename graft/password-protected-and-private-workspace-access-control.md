---
name: Password-protected and private workspace access control
slug: password-protected-and-private-workspace-access-control
type: concept
sources:
  - path: apps/platform/features/_map/workspace/workspace.selectors.ts
    hash: 764cd830fe761c9b6561437cd988064c9d2ca667fec9a64ee15f92f8731272a9
  - path: apps/platform/features/_map/workspace/workspace.slice.ts
    hash: 3bbdc0e28b7f974553bbc9bf16f4a2235521b290b75aa59201d0bca580b780aa
  - path: apps/platform/features/_map/workspace/workspace.utils.ts
    hash: 1cc0793169b6b7f2206585cccf27ae85c860dbd078695a72d66d3942f0da2852
  - path: apps/platform/features/_map/workspace/WorkspaceError.tsx
    hash: 1e6b02a878439d375ba9b4abc31884c3736753551c95d44181115dcaaaa22f1d
  - path: apps/platform/features/_map/workspace/WorkspacePassword.tsx
    hash: 89924d0181e645994359b09774b3901ab99b80a799fd1d34d1cddfd46ec70b46
sources_digest: 0d60b8976e6c0182616904f65fe64d050a5f2e0b04c4c8a51699519ebb5db3a3
links:
  - to: workspace-user-interface-components
    relation: implements
    description: >-
      Password and private workspace access control is enforced at UI layer via
      component ordering and error handling
generator:
  version: 1
covers:
  - symbol: WorkspaceError
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspaceError.tsx:L16-L48'
  - symbol: WorkspacePassword
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspacePassword.tsx:L22-L90'
  - symbol: handlePasswordChange
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspacePassword.tsx:L32-L34'
  - symbol: handleSubmit
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspacePassword.tsx:L36-L53'
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
  - symbol: parseUpsertWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L22-L28'
  - symbol: isPrivateWorkspaceNotAllowed
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L30-L37'
  - symbol: getWorkspaceLabel
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L39-L46'
  - symbol: getNextColor
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L48-L64'
  - symbol: cleanReportQuery
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L66-L84'
  - symbol: cleanReportPayload
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L91-L95'
  - symbol: getWorkspaceReport
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L97-L103'
---

<!-- context:generated:start -->

## Summary

Cross-cutting pattern: workspaces can be password-protected (validated via fetchWorkspace thunk with MIN_WORKSPACE_PASSWORD_LENGTH constraint) or marked private (requiring at least one dataview instance). Password attempts are stored in Redux state and validated on fetch; on success, VALID_PASSWORD sentinel is set rather than clearing state. Private workspace access is denied upfront via WorkspaceLoginError component, while password-protected workspaces render WorkspacePassword form. Workspace labels are appended with access-control icons (WORKSPACE_PRIVATE_ACCESS, WORKSPACE_PASSWORD_ACCESS) for visibility.

## Related

- implements [[workspace-user-interface-components]] — Password and private workspace access control is enforced at UI layer via component ordering and error handling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
