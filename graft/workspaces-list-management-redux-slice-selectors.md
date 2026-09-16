---
name: Workspaces list management (Redux slice & selectors)
slug: workspaces-list-management-redux-slice-selectors
type: system
sources:
  - path: apps/platform/features/_map/workspaces-list/workspaces-list.selectors.ts
    hash: 856c21075bdb8a58a45b41b0cc8ac2ddcffe107728920a0ca61df7e338fb7636
  - path: apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts
    hash: 1f7b5710d9f98cde2210af1a4a1729a0f5f6c8a7da6c13fbaa62bb12334cffa8
sources_digest: 7011329c00032869e48b3ff479a05272d660c6bacdf220098831ffd88099add3
links:
  - to: user-data-and-permissions
    relation: depends_on
    description: Filters workspaces based on user permissions and language preferences
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: depends_on
    description: >-
      Uses getDefaultWorkspace from workspace.slice; coordinates default
      workspace fetching
  - to: workspaces-list-configuration-and-types
    relation: depends_on
    description: >-
      Depends on static workspace metadata from WORKSPACES_BY_CATEGORY and
      HighlightedWorkspace types
  - to: workspaces-list-ui-components
    relation: implements
    description: >-
      Selectors and thunks provide state and actions consumed by WorkspacesList
      and WorkspaceWizard components
generator:
  version: 1
covers:
  - symbol: AppWorkspace
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts:L25-L25
  - symbol: FetchWorkspacesThunkParams
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts:L27-L31
  - symbol: UpdateWorkspaceThunkParams
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts:L115-L119
  - symbol: WorkspaceSliceState
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts:L174-L174
  - symbol: selectWorkspaces
    kind: function
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts:L195-L197
  - symbol: selectWorkspaceListStatus
    kind: function
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts:L198-L198
  - symbol: selectWorkspaceListStatusId
    kind: function
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts:L199-L199
---

<!-- context:generated:start -->

## Summary

Redux layer handling workspace CRUD operations (fetch, create, update, delete) against the GFW API, plus selector composition for hierarchical workspace listings merging static configuration with runtime localization and user permissions. Thunks manage async mutations with standardized error handling; selectors filter highlighted workspaces by category, apply locale-aware sorting for marine-manager, and conditionally return user-specific vs. highlighted workspaces based on location type.

## Related

- depends on [[user-data-and-permissions]] — Filters workspaces based on user permissions and language preferences
- depends on [[workspace-state-orchestration-redux-slice-selectors]] — Uses getDefaultWorkspace from workspace.slice; coordinates default workspace fetching
- depends on [[workspaces-list-configuration-and-types]] — Depends on static workspace metadata from WORKSPACES_BY_CATEGORY and HighlightedWorkspace types
- implements [[workspaces-list-ui-components]] — Selectors and thunks provide state and actions consumed by WorkspacesList and WorkspaceWizard components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
