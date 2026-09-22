---
name: Workspace Save/Edit Modal Subsystem
slug: workspace-save-edit-modal-subsystem
type: system
sources:
  - path: apps/platform/features/_map/workspace/save/workspace-save.hooks.ts
    hash: 1971a03e3b46727fcc939f6e3c9aecb202fcdf8785cacc93846cbaf24c86cd63
  - path: apps/platform/features/_map/workspace/save/workspace-save.utils.ts
    hash: 46f095bee0e82c797b88c50e137a42460cee30ae50071daf1410401962c4690a
  - path: apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx
    hash: d8e7662ec2378e03d2b0aa9f99dcc5cfd91eccc4255c6e0dbda8f41692b25258
  - path: apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx
    hash: f80f4ba666636950958ba2a8fd908221b2be61fa96756dac217b7c11e86683d4
  - path: apps/platform/features/_map/workspace/save/WorkspaceEditModal.tsx
    hash: 90793c728709deaea5a5859dab1c9a1ea12ae939379f42bd7516b2e8605076dd
sources_digest: 0b476f6607bd03cf033f53159b223b899c895c06340d7ed09f7318cbac3a513b
links:
  - to: dataview-instance-connector
    relation: uses
    description: >-
      Uses useDataviewInstancesConnect hook to update dataview visibility when
      workspace is saved/edited
  - to: router-query-parameter-management
    relation: uses
    description: Uses useReplaceQueryParams to update URL after workspace creation/edit
  - to: workspace-and-dataview-state-selectors
    relation: uses
    description: >-
      Reads current workspace, viewport, timerange, and dataview state from
      Redux selectors; dispatches workspace update/save thunks to persist
      changes
  - to: workspace-legacy-activity-category-migration
    relation: uses
    description: >-
      May run after workspace save/edit operations; the legacy category hook
      clears deprecated URL parameters if present
generator:
  version: 1
covers:
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
  - symbol: EditWorkspaceProps
    kind: type
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx:L41-L45'
  - symbol: EditWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx:L47-L240'
  - symbol: updateWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx:L73-L128'
  - symbol: onDaysFromLatestChange
    kind: function
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx:L130-L135'
  - symbol: onSelectTimeRangeChange
    kind: function
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx:L137-L142'
  - symbol: handleSubmit
    kind: function
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx:L143-L146'
  - symbol: EditWorkspaceModalProps
    kind: type
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEditModal.tsx:L14-L17'
  - symbol: EditWorkspaceModal
    kind: function
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEditModal.tsx:L19-L41'
  - symbol: onClose
    kind: function
    at: 'apps/platform/features/_map/workspace/save/WorkspaceEditModal.tsx:L26-L28'
  - symbol: useSaveWorkspaceModalConnect
    kind: function
    at: 'apps/platform/features/_map/workspace/save/workspace-save.hooks.ts:L23-L44'
  - symbol: useSaveWorkspaceTimerange
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/workspace-save.hooks.ts:L48-L120
  - symbol: isValidDaysFromLatest
    kind: function
    at: 'apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L19-L25'
  - symbol: formatTimerangeBoundary
    kind: function
    at: 'apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L27-L35'
  - symbol: getViewAccessOptions
    kind: function
    at: 'apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L37-L52'
  - symbol: WorkspaceTimeRangeMode
    kind: type
    at: 'apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L54-L54'
  - symbol: getTimeRangeOptions
    kind: function
    at: 'apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L55-L73'
  - symbol: getEditAccessOptions
    kind: function
    at: 'apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L75-L83'
  - symbol: getEditAccessOptionsByViewAccess
    kind: function
    at: 'apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L85-L92'
  - symbol: getStaticWorkspaceName
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L94-L103
  - symbol: getDynamicWorkspaceName
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L105-L109
  - symbol: getWorkspaceTimerangeName
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L111-L126
  - symbol: ReplaceTimerangeWorkspaceNameParams
    kind: type
    at: >-
      apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L128-L135
  - symbol: replaceTimerangeWorkspaceName
    kind: function
    at: >-
      apps/platform/features/_map/workspace/save/workspace-save.utils.ts:L136-L157
---

<!-- context:generated:start -->

## Summary

Manages creation and editing of map workspaces through modal dialogs, handling access control configuration (public/private/password-protected), time range settings (static vs. dynamic days-from-latest), workspace metadata, and persistence via Redux thunks. Dynamically rewrites workspace names when time range settings change and enforces edit access hierarchy constraints.

## Related

- uses [[dataview-instance-connector]] — Uses useDataviewInstancesConnect hook to update dataview visibility when workspace is saved/edited
- uses [[router-query-parameter-management]] — Uses useReplaceQueryParams to update URL after workspace creation/edit
- uses [[workspace-and-dataview-state-selectors]] — Reads current workspace, viewport, timerange, and dataview state from Redux selectors; dispatches workspace update/save thunks to persist changes
- uses [[workspace-legacy-activity-category-migration]] — May run after workspace save/edit operations; the legacy category hook clears deprecated URL parameters if present

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
