---
name: Two-Step File Upload Flow
slug: two-step-file-upload-flow
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.slice.ts
    hash: af8ff6cca5a9256bdd3666a0816fa59ca68e9f81ddfe58c85c6ab5981d16d343
  - path: apps/platform/features/_map/datasets/upload/DatasetTypeSelect.tsx
    hash: f4afddbc78202837972641ada900e23a6967808adbebb673d1722739c53595be
  - path: apps/platform/features/_map/datasets/upload/FileDropzone.tsx
    hash: 8f510820c3f47d9f9d0db66224d86a8a02801cd7919e4547c79b483aff6a4efb
  - path: apps/platform/features/_map/datasets/upload/NewDataset.tsx
    hash: 76c2c52e6619176a925d806d2ca7625f7629db08670159fe4c60d9a17274bfbb
sources_digest: 0de35a78c36fe643322c7f07b3183958ab4fb7bcecea1e79fffbe2853dc40041
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
  - symbol: DatasetType
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/DatasetTypeSelect.tsx:L18-L98'
  - symbol: DatasetTypeSelect
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/DatasetTypeSelect.tsx:L100-L148
  - symbol: FileDropzoneProps
    kind: interface
    at: 'apps/platform/features/_map/datasets/upload/FileDropzone.tsx:L36-L43'
  - symbol: FileDropzone
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/FileDropzone.tsx:L45-L128'
  - symbol: OnConfirmParams
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L43-L43'
  - symbol: NewDatasetProps
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L44-L51'
  - symbol: DatasetMetadata
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L53-L60'
  - symbol: NewDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewDataset.tsx:L62-L274'
---

<!-- context:generated:start -->

## Summary

Dataset creation leverages a two-step upload pattern: POST raw file to /uploads endpoint to obtain a presigned S3 URL, then PUT the file directly to S3. Content-type is sniffed (NetCDF, GeoJSON, TIFF) and file extensions are validated via geometry-specific MIME mappings. This design offloads large file transfers to S3 while keeping metadata in the platform API.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
