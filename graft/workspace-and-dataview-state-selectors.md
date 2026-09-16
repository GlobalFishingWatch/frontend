---
name: Workspace and Dataview State Selectors
slug: workspace-and-dataview-state-selectors
type: system
sources:
  - path: apps/platform/features/_map/workspace/selectors/app.data-date.selectors.ts
    hash: 62e8fb094fffc8961c5277312a584bbe7442df095fa47d8b52bd70def4626bb7
  - path: apps/platform/features/_map/workspace/selectors/app.selectors.ts
    hash: ba4032fe83030126b077b99ad859f62d6347a1c024a3ed3cebc0e4cb6bd15f2c
  - path: apps/platform/features/_map/workspace/selectors/app.timebar.selectors.ts
    hash: 6d5dabcb994acafe8c4de82aa9aea941bd8a50f8cc017304c3ebd33a15f57178
  - path: apps/platform/features/_map/workspace/selectors/app.viewport.selectors.ts
    hash: cc73e1d2b7fdcd9bed4513b7480b379dcc0c806fc8d6fa55790b2863c48d6a87
  - path: apps/platform/features/_map/workspace/selectors/app.workspace.selectors.ts
    hash: e211e98ea4c9da1a0d37eff2ddb13e554d81d8e1f004f9894558a2bc545eeb73
sources_digest: 7b80ae26ab6db6f43d6ac3b9842148504f1158fc204e29b8c3c7a74f41d93bd5
links:
  - to: deck-gl-bundle-splitting-strategy
    relation: depends_on
    description: >-
      app.selectors isolates deck-layers imports to prevent bundling the library
      into every entry chunk; imports HEATMAP_HIGH_RES_ID for conditional
      visualization mode overrides
  - to: layer-filter-and-properties-components
    relation: uses
    description: >-
      LayerFilters, LayerProperties, and related components read visualization
      mode selectors to determine available UI controls and apply mode
      constraints
  - to: workspace-save-edit-modal-subsystem
    relation: uses
    description: >-
      Workspace save/edit forms call selectWorkspaceWithCurrentState to capture
      current application state for serialization
generator:
  version: 1
covers:
  - symbol: Complete
    kind: type
    at: >-
      apps/platform/features/_map/workspace/selectors/app.workspace.selectors.ts:L73-L73
  - symbol: NonPersistedWorkspaceStateKey
    kind: type
    at: >-
      apps/platform/features/_map/workspace/selectors/app.workspace.selectors.ts:L76-L90
---

<!-- context:generated:start -->

## Summary

Redux selector layer that aggregates workspace, viewport, timerange, and map UI state into coherent views for components. Maintains explicit precedence (URL > workspace > defaults) and excludes non-persisted runtime state (screenshot mode, readOnly flags) from serialization. Includes specialized selectors for timebar visualization mode, activity/detections visualization overrides for report contexts, and latest available data date derivation across visible datasets.

## Related

- depends on [[deck-gl-bundle-splitting-strategy]] — app.selectors isolates deck-layers imports to prevent bundling the library into every entry chunk; imports HEATMAP_HIGH_RES_ID for conditional visualization mode overrides
- uses [[layer-filter-and-properties-components]] — LayerFilters, LayerProperties, and related components read visualization mode selectors to determine available UI controls and apply mode constraints
- uses [[workspace-save-edit-modal-subsystem]] — Workspace save/edit forms call selectWorkspaceWithCurrentState to capture current application state for serialization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
