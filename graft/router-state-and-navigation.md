---
name: Router state and navigation
slug: router-state-and-navigation
type: concept
sources:
  - path: apps/platform/features/_map/workspace/workspace.selectors.ts
    hash: 764cd830fe761c9b6561437cd988064c9d2ca667fec9a64ee15f92f8731272a9
  - path: apps/platform/features/_map/workspace/Workspace.tsx
    hash: 05602d715364a03a41cc315af05e65936f1b9aa7d49d0a8e7bafbce085f77569
  - path: apps/platform/features/_map/workspaces-list/WorkspacesList.tsx
    hash: 65d67857a17bcfce36fba879935ac3802cc069254ada8f65d9f17ebf8010001b
  - path: apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx
    hash: 1e44835831d1c089c147ae90891d9d885b66c87349d1a50a6f75b03fee78b8ca
  - path: >-
      apps/platform/features/_reports/report-area/area-reports.buffer.selectors.ts
    hash: f9ab53669b8403ef18ec533e10397625c28595bad856767e013ec88139711fe0
sources_digest: 1bbcde879eed46c908efbda23a9e2f3dea39f6ecb37c9cfcfe9f334f7185ed7b
links:
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: implements
    description: Workspace selectors and thunks read and respond to route state
  - to: workspaces-list-ui-components
    relation: implements
    description: Navigation components construct routes based on workspace category and ID
generator:
  version: 1
covers:
  - symbol: Workspace
    kind: function
    at: 'apps/platform/features/_map/workspace/Workspace.tsx:L44-L119'
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
  - symbol: WorkspacesList
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspacesList.tsx:L26-L194'
---

<!-- context:generated:start -->

## Summary

Cross-cutting pattern: workspace context is determined by route state (category, workspaceId, reportId), and workspace fetch parameters are derived from route-aware logic handling multiple workspace routes (workspace, report, vessel group report). Drag-and-drop dataview reordering and buffer configuration changes persist to query parameters via replaceQueryParams. Route changes trigger workspace fetch thunks conditionally, and route-based selectors provide workspace IDs defaulting to DEFAULT_WORKSPACE_ID when needed.

## Related

- implements [[workspace-state-orchestration-redux-slice-selectors]] — Workspace selectors and thunks read and respond to route state
- implements [[workspaces-list-ui-components]] — Navigation components construct routes based on workspace category and ID

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
