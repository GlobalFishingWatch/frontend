---
name: Workspace user interface components
slug: workspace-user-interface-components
type: system
sources:
  - path: apps/platform/features/_map/workspace/Workspace.tsx
    hash: 05602d715364a03a41cc315af05e65936f1b9aa7d49d0a8e7bafbce085f77569
  - path: apps/platform/features/_map/workspace/WorkspaceError.tsx
    hash: 1e6b02a878439d375ba9b4abc31884c3736753551c95d44181115dcaaaa22f1d
  - path: apps/platform/features/_map/workspace/WorkspaceLayout.tsx
    hash: 4018106858e238a3ec7942bf82e3dc21fdb6d78e4255d8f07483e8c0b80f062c
  - path: apps/platform/features/_map/workspace/WorkspaceLoginError.tsx
    hash: efeedcdee1dfac160dcdf4df1f7821488d4f8a12415279161cf80b02c070956f
  - path: apps/platform/features/_map/workspace/WorkspacePassword.tsx
    hash: 89924d0181e645994359b09774b3901ab99b80a799fd1d34d1cddfd46ec70b46
  - path: apps/platform/features/_map/workspace/WorkspaceTitle.tsx
    hash: 9fc550dc71c934d6bf903c25a95edb79041a60742c8994b9d6274945f0708b8d
sources_digest: 6b43bf1d3057171ab4e6488a01d30f2e64e5563f237a3ff66db7269fc7ba1b34
links:
  - to: router-state-and-navigation
    relation: depends_on
    description: >-
      Reads location category and workspace ID from routes; uses
      replaceQueryParams to persist reordering
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: uses
    description: >-
      Consumes workspace selectors and dispatches thunks for data loading,
      password validation, and workspace updates
  - to: workspace-utilities-and-validation
    relation: uses
    description: >-
      Validates private workspaces via isPrivateWorkspaceNotAllowed, formats
      titles via getWorkspaceLabel
generator:
  version: 1
covers:
  - symbol: Workspace
    kind: function
    at: 'apps/platform/features/_map/workspace/Workspace.tsx:L44-L119'
  - symbol: WorkspaceError
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspaceError.tsx:L16-L48'
  - symbol: WorkspaceLayout
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspaceLayout.tsx:L8-L10'
  - symbol: WorkspaceLoginErrorProps
    kind: interface
    at: 'apps/platform/features/_map/workspace/WorkspaceLoginError.tsx:L18-L23'
  - symbol: WorkspaceLoginError
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspaceLoginError.tsx:L25-L71'
  - symbol: WorkspacePassword
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspacePassword.tsx:L22-L90'
  - symbol: handlePasswordChange
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspacePassword.tsx:L32-L34'
  - symbol: handleSubmit
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspacePassword.tsx:L36-L53'
  - symbol: WorkspaceTitle
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspaceTitle.tsx:L28-L148'
  - symbol: openDSMPopup
    kind: function
    at: 'apps/platform/features/_map/workspace/WorkspaceTitle.tsx:L76-L78'
---

<!-- context:generated:start -->

## Summary

React components rendering the main workspace container, layout routes, error handling, password authentication, and title/metadata editing. Composed components include ActivitySection, DetectionsSection, EventsSection, VesselsSection, VesselGroupSection, EnvironmentalSection, ContextAreaSection, and UserSection; orchestrates drag-and-drop reordering of dataviews, handles loading/auth/error states, and coordinates with workspace state management.

## Related

- depends on [[router-state-and-navigation]] — Reads location category and workspace ID from routes; uses replaceQueryParams to persist reordering
- uses [[workspace-state-orchestration-redux-slice-selectors]] — Consumes workspace selectors and dispatches thunks for data loading, password validation, and workspace updates
- uses [[workspace-utilities-and-validation]] — Validates private workspaces via isPrivateWorkspaceNotAllowed, formats titles via getWorkspaceLabel

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
