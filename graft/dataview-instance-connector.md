---
name: Dataview Instance Connector
slug: dataview-instance-connector
type: concept
sources:
  - path: apps/platform/features/_map/workspace/legacy-activity-category.hook.ts
    hash: 8db957a20d0fa2ff72fb7c5dc690f220aa30017f4acfcbc80579028f201f260d
  - path: apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx
    hash: d8e7662ec2378e03d2b0aa9f99dcc5cfd91eccc4255c6e0dbda8f41692b25258
  - path: apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx
    hash: 59a96af07c43483b9b8f4e18fd1195b762f3fb4f0521f3fddbfd297ba7121578
  - path: apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx
    hash: 7683a044f46cdb352e05edea36feb7852cfa772572e6c7156cf9fa585df6def3
  - path: apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts
    hash: 8da104da9d7f9af60b1a3998bb70b125d27852c10551accb772a27be56ecac6e
  - path: apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx
    hash: 2ab7c67a0175fb07d16d42e2562007d432d6681a2d844d8fdf2ebb1f44b86ebd
sources_digest: 7f2de62136b02c487cfcddd0cff7b213e2f46d461eeec59e4738366ca90f4e21
links:
  - to: layer-filter-and-properties-components
    relation: uses
    description: >-
      LayerFilters, LayerFiltersSource, and DatasetSchemaField all call
      upsertDataviewInstance to persist filter selections and field updates
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
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L33-L39
  - symbol: DatasetSchemaField
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L41-L166
  - symbol: toDisplay
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L90-L90
  - symbol: DatasetFilterSourceProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx:L15-L21
  - symbol: DatasetFilterSource
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx:L23-L105
  - symbol: onRemoveFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx:L59-L63
  - symbol: UseLayerFilterStateParams
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L30-L34'
  - symbol: useLayerFilterState
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L36-L168
  - symbol: UseLayerFilterHandlersParams
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L170-L174
  - symbol: useLayerFilterHandlers
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L176-L345
  - symbol: onSelectHistogramRangeFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L183-L203
  - symbol: onSelectFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L205-L265
  - symbol: onSelectFilterOperationClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L267-L293
  - symbol: onRemoveFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L295-L318
  - symbol: onCleanFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L320-L336
  - symbol: LayerFiltersSourceProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L23-L27
  - symbol: LayerFiltersSource
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L29-L86
  - symbol: onSelectSourceClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L45-L59
  - symbol: onRemoveSourceClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L61-L68
---

<!-- context:generated:start -->

## Summary

Hook abstraction (useDataviewInstancesConnect) that bridges UI components and Redux state management for dataview visibility, filtering, and configuration updates. Provides upsertDataviewInstance callback to apply batch changes, ensuring consistent state synchronization across the workspace without tight coupling to Redux dispatch mechanism.

## Related

- uses [[layer-filter-and-properties-components]] — LayerFilters, LayerFiltersSource, and DatasetSchemaField all call upsertDataviewInstance to persist filter selections and field updates

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
