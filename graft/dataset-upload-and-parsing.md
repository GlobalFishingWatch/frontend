---
name: Dataset Upload and Parsing
slug: dataset-upload-and-parsing
type: system
sources:
  - path: apps/platform/features/_map/datasets/upload/DatasetFieldLabel.tsx
    hash: befab4390c55cc6af3ba42fef1e91b2224a77929b25d033c5a6e0f7c67029243
  - path: apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts
    hash: e1d1529faf3dd1869bc953ed7a616fa229cba12686b125e55dfbd1de786c5427
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx
    hash: 44fb021ae09c0e5998db5ba705db09cb4474182f21c8325355ff03338956176e
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts
    hash: 377e35f85ab80721d794200c748a7ac847550158b04b573114d0bcc5afeb5242
  - path: apps/platform/features/_map/datasets/upload/DatasetTypeSelect.tsx
    hash: f4afddbc78202837972641ada900e23a6967808adbebb673d1722739c53595be
  - path: apps/platform/features/_map/datasets/upload/FileDropzone.tsx
    hash: 8f510820c3f47d9f9d0db66224d86a8a02801cd7919e4547c79b483aff6a4efb
  - path: apps/platform/features/_map/datasets/upload/NewDataset.tsx
    hash: 76c2c52e6619176a925d806d2ca7625f7629db08670159fe4c60d9a17274bfbb
  - path: apps/platform/features/_map/datasets/upload/NewDatasetField.tsx
    hash: e11aabea230f0e251bbc946377bfa0bdfa3b93f914cfa8066144a522e5c6db3a
  - path: apps/platform/features/_map/datasets/upload/NewGriddedDataset.tsx
    hash: e581d4491c68d628157484ca566415d72c313a4e1da2a485457002737bebd523
  - path: apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx
    hash: d8ad34bee242a49bbd1765152c24cd50477f7941e3b8c5cb7d5ab88ad5385756
  - path: apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx
    hash: 320202a7474190245bbefedd8135759938ddf1bfb5c486709d11b092be3aa7ef
  - path: apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx
    hash: 76d1ff5cdb07bd33661dc9e21815e05276bea20812308321d1dcabc78c76253d
  - path: apps/platform/features/_map/datasets/upload/TimeFieldsGroup.tsx
    hash: 1c65502394574e9f0b58476c9b106fae9c2c83dee8c001591cde6ca6d748c83a
sources_digest: d4fec98a3102b8525e904228d72e9c58e1c45f7807fd9acb4b24ab7b44e7c875
links:
  - to: dataset-management-redux-layer
    relation: uses
    description: >-
      Upload modal reads Redux state for auth status and writes to modals.slice
      for UI state; NewDataset dispatches upsertDataset thunk to create/update
      datasets
  - to: dataset-utilities-and-filtering
    relation: uses
    description: >-
      Upload UI calls privacy check utilities (isPrivateDataset,
      isGFWOnlyDataset) and retrieves dataset icons/labels for display
  - to: dataviews-management
    relation: uses
    description: >-
      After upload succeeds, NewDataset optionally adds the new dataset to the
      active workspace via addDataviewFromDatasetToWorkspace
  - to: geospatial-data-transform-contracts
    relation: depends_on
    description: >-
      Parsing and validation rely on @globalfishingwatch/datasets-client
      configuration APIs and @globalfishingwatch/data-transforms file utilities
generator:
  version: 1
covers:
  - symbol: DatasetFieldLabel
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/DatasetFieldLabel.tsx:L3-L28'
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
  - symbol: NewDatasetFieldProps
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewDatasetField.tsx:L14-L23'
  - symbol: NewDatasetField
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewDatasetField.tsx:L32-L90'
  - symbol: NewGriddedDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewGriddedDataset.tsx:L40-L266'
  - symbol: parseFile
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewGriddedDataset.tsx:L75-L120'
  - symbol: PointsGeojson
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx:L52-L52'
  - symbol: NewPointDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx:L54-L449'
  - symbol: updateFileType
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx:L82-L87'
  - symbol: PolygonFeatureCollection
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx:L46-L46'
  - symbol: NewPolygonDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx:L48-L320'
  - symbol: updateFileType
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx:L74-L77'
  - symbol: NewTrackDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx:L49-L453'
  - symbol: updateFileType
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx:L71-L76'
  - symbol: TimeFilterTypeOption
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/TimeFieldsGroup.tsx:L16-L16'
  - symbol: getTimeFilterOptions
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/TimeFieldsGroup.tsx:L19-L26'
  - symbol: TimeFieldsGroupProps
    kind: type
    at: 'apps/platform/features/_map/datasets/upload/TimeFieldsGroup.tsx:L28-L33'
  - symbol: TimeFieldsGroup
    kind: function
    at: 'apps/platform/features/_map/datasets/upload/TimeFieldsGroup.tsx:L35-L197'
  - symbol: DataList
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L41-L41
  - symbol: GriddedData
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L42-L42
  - symbol: DatasetParsedByType
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L43-L48
  - symbol: DataParsed
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L49-L49
  - symbol: validateFeatures
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L59-L119
  - symbol: validatedGeoJSON
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L121-L124
  - symbol: getDatasetParsed
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L126-L189
  - symbol: getTrackFromList
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L191-L206
  - symbol: getGeojsonFromPointsList
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L208-L225
  - symbol: getNormalizedGeojsonFromPointsGeojson
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L227-L235
  - symbol: useDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L21-L69
  - symbol: FieldOption
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L72-L72
  - symbol: useDatasetMetadataOptions
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L73-L177
  - symbol: getDatasetMetadataValidations
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L45-L56
  - symbol: ExtractMetadataProps
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L58-L62
  - symbol: getMetadataFromDataset
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L64-L76
  - symbol: getBaseDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L78-L96
  - symbol: getTracksDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L98-L117
  - symbol: getPointsDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L119-L145
  - symbol: GriddedSourceFormat
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L147-L147
  - symbol: getGriddedDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L149-L178
  - symbol: getPolygonsDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L180-L209
  - symbol: getFinalDatasetFromMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L211-L242
  - symbol: getPropertiesIdClean
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L244-L255
  - symbol: parseGeoJsonProperties
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L256-L306
---

<!-- context:generated:start -->

## Summary

Orchestrates the complete workflow for users to upload geospatial data files (shapefile, CSV, KML, GeoJSON, GeoTIFF, NetCDF) and transform them into platform datasets. Handles file type detection, geometry-specific parsing, metadata configuration, validation, and API submission through a multi-step modal UI.

## Related

- uses [[dataset-management-redux-layer]] — Upload modal reads Redux state for auth status and writes to modals.slice for UI state; NewDataset dispatches upsertDataset thunk to create/update datasets
- uses [[dataset-utilities-and-filtering]] — Upload UI calls privacy check utilities (isPrivateDataset, isGFWOnlyDataset) and retrieves dataset icons/labels for display
- uses [[dataviews-management]] — After upload succeeds, NewDataset optionally adds the new dataset to the active workspace via addDataviewFromDatasetToWorkspace
- depends on [[geospatial-data-transform-contracts]] — Parsing and validation rely on @globalfishingwatch/datasets-client configuration APIs and @globalfishingwatch/data-transforms file utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
