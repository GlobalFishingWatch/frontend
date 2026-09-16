---
name: Workspace Persistence and Migration
slug: workspace-persistence-and-migration
type: system
sources:
  - path: apps/platform/features/_map/workspace/workspace-load.hook.ts
    hash: 01171a4dc24f2e4d5f407e6f29aeacbae7fa1e343d55559cf7fe1de39861404d
  - path: apps/platform/features/_map/workspace/workspace-migration.hooks.tsx
    hash: d37fe3222af542f41f9926ee2b2a10dc43fc599e1567409d1a873ed0f6b5ab92
sources_digest: f4cfa6057639291c9d8723a74a51cb32ced83b920b6778d93d32eb9398eed3de
links:
  - to: vessel-groups-management
    relation: uses
    description: >-
      Migration system handles deprecated vessel group instances via
      migrateAllDataviewInstances
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      Workspace load hooks sync workspace dataview instances to Redux state and
      URL query parameters
generator:
  version: 1
covers:
  - symbol: useFitWorkspaceBounds
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace-load.hook.ts:L34-L66'
  - symbol: useFetchWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace-load.hook.ts:L68-L100'
  - symbol: useEnsureWorkspaceLoad
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace-load.hook.ts:L102-L119'
  - symbol: useMigrateWorkspaceToast
    kind: function
    at: >-
      apps/platform/features/_map/workspace/workspace-migration.hooks.tsx:L31-L144
  - symbol: closeToast
    kind: function
    at: >-
      apps/platform/features/_map/workspace/workspace-migration.hooks.tsx:L48-L50
  - symbol: onMigrateAllClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/workspace-migration.hooks.tsx:L52-L76
  - symbol: ToastContent
    kind: function
    at: >-
      apps/platform/features/_map/workspace/workspace-migration.hooks.tsx:L83-L111
---

<!-- context:generated:start -->

## Summary

Hooks and thunks (useFetchWorkspace, useEnsureWorkspaceLoad, useMigrateWorkspaceToast) that orchestrate workspace loading, viewport/timerange synchronization, and automated migration of deprecated dataviews and datasets. Prevents duplicate fetches while loading, applies saved viewport and timerange to map view, and displays interactive toast prompts to workspace owners about deprecations. Migration workflow calls migrateAllDataviewInstances, merges results via mergeDataviewIntancesToUpsert, and persists via updateCurrentWorkspaceThunk before navigation.

## Related

- uses [[vessel-groups-management]] — Migration system handles deprecated vessel group instances via migrateAllDataviewInstances
- uses [[workspace-dataview-instance-management]] — Workspace load hooks sync workspace dataview instances to Redux state and URL query parameters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
