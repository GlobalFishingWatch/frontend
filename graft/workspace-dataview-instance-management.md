---
name: Workspace Dataview Instance Management
slug: workspace-dataview-instance-management
type: system
sources:
  - path: apps/platform/features/_map/workspace/workspace-load.hook.ts
    hash: 01171a4dc24f2e4d5f407e6f29aeacbae7fa1e343d55559cf7fe1de39861404d
  - path: apps/platform/features/_map/workspace/workspace.hook.ts
    hash: a506fb7f6acabaef706ebe2545d6afa9f25dca98c9637938098884bdb84edce1
sources_digest: 77bb76f0f863f40d0e57b6973e00b7a3917a3fbf4b2aeab3872543f051f6f62d
links:
  - to: layer-visibility-toggling
    relation: uses
    description: >-
      LayerSwitch, Title, LayerPanel components call upsertDataviewInstance to
      persist visibility changes to Redux and URL
  - to: schema-based-filtering
    relation: uses
    description: >-
      Filters system calls upsertDataviewInstance to persist filter value
      changes back to dataview config
  - to: workspace-panel-organization
    relation: uses
    description: >-
      Section component uses useDataviewInstancesConnect to toggle collapse
      state in Redux and persist to URL
  - to: workspace-persistence-and-migration
    relation: depends_on
    description: >-
      Loads workspace from Redux store and uses updateCurrentWorkspaceThunk to
      persist deletions and migrations
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
  - symbol: createDataviewsInstances
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.hook.ts:L18-L46'
  - symbol: mergeDataviewIntancesToUpsert
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.hook.ts:L48-L81'
  - symbol: useDataviewInstancesConnect
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.hook.ts:L83-L162'
---

<!-- context:generated:start -->

## Summary

Redux-backed hooks and utilities that orchestrate the creation, update, and deletion of dataview instances (map layers) displayed in the workspace. Manages bidirectional sync between URL query parameters, Redux state, and user actions through callbacks like upsertDataviewInstance and deleteDataviewInstance, with intelligent merging logic to preserve existing configurations and automatic color cycling from predefined library palettes.

## Related

- uses [[layer-visibility-toggling]] — LayerSwitch, Title, LayerPanel components call upsertDataviewInstance to persist visibility changes to Redux and URL
- uses [[schema-based-filtering]] — Filters system calls upsertDataviewInstance to persist filter value changes back to dataview config
- uses [[workspace-panel-organization]] — Section component uses useDataviewInstancesConnect to toggle collapse state in Redux and persist to URL
- depends on [[workspace-persistence-and-migration]] — Loads workspace from Redux store and uses updateCurrentWorkspaceThunk to persist deletions and migrations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
