---
name: Dataset Management Redux Layer
slug: dataset-management-redux-layer
type: system
sources:
  - path: apps/platform/features/_map/datasets/datasets.mock.ts
    hash: 374bd82dfd78af5f2c9fd83dc9156745bb6a8e8b82c4b8377c3fca01aa5288a7
  - path: apps/platform/features/_map/datasets/datasets.selectors.ts
    hash: 2dba31ceeeb77270b13479ca9fc6778107625da3934b0039a5be714266cd5c7e
  - path: apps/platform/features/_map/datasets/datasets.slice.ts
    hash: af8ff6cca5a9256bdd3666a0816fa59ca68e9f81ddfe58c85c6ab5981d16d343
sources_digest: 0e893aec5edcf03ef6346490205f1637508d7c1f863dfc4762cc82c623971513
links:
  - to: dataset-utilities-and-filtering
    relation: uses
    description: >-
      Selectors delegate privacy checks and dataset classification to utility
      functions; mock module provides fallback test data
  - to: dataviews-management
    relation: uses
    description: >-
      Selectors (selectVesselsDatasets, selectFourwingsDatasets, etc.) are
      consumed by dataview factories to instantiate layer configs
  - to: geospatial-data-transform-contracts
    relation: depends_on
    description: >-
      Async thunks use GFWAPI client, datasets-client configuration parsing, and
      type definitions from @globalfishingwatch/api-types
generator:
  version: 1
covers:
  - symbol: selectDatasetsByType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.selectors.ts:L17-L32'
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

Implements Redux state management for datasets via async thunks (fetch, create, update, delete), entity adapter normalization, and selectors that partition datasets by type, geometry, and user compatibility. Handles batch fetching with recursive related-dataset discovery, deprecated dataset tracking, and file upload integration with S3 presigned URLs.

## Related

- uses [[dataset-utilities-and-filtering]] — Selectors delegate privacy checks and dataset classification to utility functions; mock module provides fallback test data
- uses [[dataviews-management]] — Selectors (selectVesselsDatasets, selectFourwingsDatasets, etc.) are consumed by dataview factories to instantiate layer configs
- depends on [[geospatial-data-transform-contracts]] — Async thunks use GFWAPI client, datasets-client configuration parsing, and type definitions from @globalfishingwatch/api-types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
