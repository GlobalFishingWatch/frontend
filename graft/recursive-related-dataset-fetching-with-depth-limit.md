---
name: Recursive Related Dataset Fetching with Depth Limit
slug: recursive-related-dataset-fetching-with-depth-limit
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.slice.ts
    hash: af8ff6cca5a9256bdd3666a0816fa59ca68e9f81ddfe58c85c6ab5981d16d343
sources_digest: a6a348395f2747c49021b2d80e5e87d8e8438e55c841fc75e0bbe47733457168
links: []
generator:
  version: 1
covers:
  - symbol: getAPILocale
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L37-L41'
  - symbol: DatasetsState
    kind: interface
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L43-L46'
  - symbol: DatasetsSliceState
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L48-L48'
  - symbol: FetchUserDatasetsMode
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L83-L83'
  - symbol: FetchDatasetsBatchParams
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L85-L93'
  - symbol: fetchDatasetsBatch
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L95-L187'
  - symbol: fetchDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L119-L139'
  - symbol: FetchAllDatasetsParams
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L307-L308'
  - symbol: getAllDatasetsRequestKey
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L311-L314'
  - symbol: UpsertDataset
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L339-L344'
  - symbol: selectDatasetsStatus
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L533-L533'
  - symbol: selectDatasetsStatusId
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L534-L534'
  - symbol: selectDatasetsError
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L535-L535'
  - symbol: selectSliceDeprecatedDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L536-L537'
  - symbol: selectDeletedDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L538-L538'
---

<!-- context:generated:start -->

## Summary

When fetching a single dataset, the fetchDatasetsByIdsThunk recursively discovers and fetches related datasets up to MAX_RELATED_FETCH_DEPTH to avoid unbounded API calls. Deduplication via Set prevents fetching the same ID twice. This strategy allows UI layers to access complete dataset dependency graphs with a single selector call.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
