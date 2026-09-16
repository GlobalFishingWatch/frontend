---
name: Global Polling State for Import Refresh
slug: global-polling-state-for-import-refresh
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.hook.ts
    hash: 876f6d2799f63e2c3f3a90db45d222110617e22c653a4331c12422bd1f7e3f87
sources_digest: 6d3770ead6746bf98d9f7a2e725803fe2922fa2ad0ccd2e628126dd127b4c6d7
links: []
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

The useAutoRefreshImportingDataset hook maintains a module-level pollingDatasetIds Set to prevent concurrent polling of the same dataset across multiple hook instances. Each dataset in 'Importing' status is polled every 10 seconds (DATASET_REFRESH_TIMEOUT) until the status changes. Effect cleanup logic removes the dataset ID from the Set to allow re-polling if the hook re-mounts, avoiding indefinite duplicate polls.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
