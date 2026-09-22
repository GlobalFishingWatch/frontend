---
name: Router Query Parameter Management
slug: router-query-parameter-management
type: concept
sources:
  - path: apps/platform/features/_map/workspace/legacy-activity-category.hook.ts
    hash: 8db957a20d0fa2ff72fb7c5dc690f220aa30017f4acfcbc80579028f201f260d
  - path: apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx
    hash: d8e7662ec2378e03d2b0aa9f99dcc5cfd91eccc4255c6e0dbda8f41692b25258
  - path: apps/platform/features/_map/workspace/shared/GlobalReportLink.tsx
    hash: f317af6d30a5b0e2f5718126340c0bafd3ff2450b193eff7f941c7f533f36101
sources_digest: 19f88b3062272551da66fcf079e0253ea7c148842f95a8fbec8d915fa9eefc18
links:
  - to: workspace-and-dataview-state-selectors
    relation: depends_on
    description: >-
      Selectors implement URL-first fallback strategy; route parameters take
      precedence over workspace state
generator:
  version: 1
covers:
  - symbol: useHideLegacyActivityCategoryDataviews
    kind: function
    at: >-
      apps/platform/features/_map/workspace/legacy-activity-category.hook.ts:L16-L55
  - symbol: CreateWorkspaceModalProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L52-L55
  - symbol: CreateWorkspaceModal
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L57-L343
  - symbol: onClose
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L93-L95
  - symbol: onNameChange
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L97-L99
  - symbol: setDefaultWorkspaceName
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L101-L140
  - symbol: getWorkspaceError
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L148-L161
  - symbol: createWorkspace
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L163-L219
  - symbol: onDaysFromLatestChange
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L221-L226
  - symbol: onSelectTimeRangeChange
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L228-L233
  - symbol: handleSubmit
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx:L235-L238
  - symbol: GlobalReportLink
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/GlobalReportLink.tsx:L15-L46'
---

<!-- context:generated:start -->

## Summary

Hook abstraction (useReplaceQueryParams) and route navigation patterns that manage URL state for map configuration, workspaces, and reports. Enforces precedence: URL query parameters override workspace state, which overrides defaults. Used throughout save/edit flows and legacy migration to synchronize URL and application state.

## Related

- depends on [[workspace-and-dataview-state-selectors]] — Selectors implement URL-first fallback strategy; route parameters take precedence over workspace state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
