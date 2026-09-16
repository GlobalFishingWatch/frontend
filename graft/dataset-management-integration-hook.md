---
name: Dataset Management Integration Hook
slug: dataset-management-integration-hook
type: file
sources:
  - path: apps/platform/features/_map/datasets/datasets.hook.ts
    hash: 876f6d2799f63e2c3f3a90db45d222110617e22c653a4331c12422bd1f7e3f87
sources_digest: 6d3770ead6746bf98d9f7a2e725803fe2922fa2ad0ccd2e628126dd127b4c6d7
links:
  - to: dataset-management-redux-layer
    relation: uses
    description: >-
      Wraps fetchDatasetByIdThunk, upsertDatasetThunk, updateDatasetThunk,
      deleteDatasetThunk into promise-based hooks with error handling
  - to: dataset-upload-and-parsing
    relation: uses
    description: >-
      NewDataset component uses useDatasetsAPI to dispatch dataset creation and
      useAddDataviewFromDatasetToWorkspace to integrate into workspace
  - to: dataviews-management
    relation: uses
    description: >-
      Calls useDataviewInstancesConnect to push dataview instances after dataset
      upload succeeds
generator:
  version: 1
covers:
  - symbol: NewDatasetProps
    kind: interface
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L44-L46'
  - symbol: getDataviewInstanceByDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L50-L78'
  - symbol: useAddDataviewFromDatasetToWorkspace
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L80-L96'
  - symbol: useDatasetModalOpenConnect
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L98-L116'
  - symbol: useDatasetModalConfigConnect
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L118-L136'
  - symbol: useDatasetsAPI
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L138-L198'
  - symbol: useAutoRefreshImportingDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L202-L241'
  - symbol: refreshDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L219-L229'
  - symbol: useAddDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.hook.ts:L243-L260'
---

<!-- context:generated:start -->

## Summary

Exports utility React hooks that bridge Redux dataset operations with UI components, including promise-based wrappers around dataset CRUD thunks (useDatasetsAPI), automatic refresh polling for importing datasets (useAutoRefreshImportingDataset with 10-second timeout and duplicate-prevention via module-level pollingDatasetIds Set), and modal/workspace integration (useAddDataviewFromDatasetToWorkspace, useDatasetModalOpenConnect).

## Related

- uses [[dataset-management-redux-layer]] — Wraps fetchDatasetByIdThunk, upsertDatasetThunk, updateDatasetThunk, deleteDatasetThunk into promise-based hooks with error handling
- uses [[dataset-upload-and-parsing]] — NewDataset component uses useDatasetsAPI to dispatch dataset creation and useAddDataviewFromDatasetToWorkspace to integrate into workspace
- uses [[dataviews-management]] — Calls useDataviewInstancesConnect to push dataview instances after dataset upload succeeds

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
