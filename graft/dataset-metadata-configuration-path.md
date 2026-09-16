---
name: Dataset Metadata Configuration Path
slug: dataset-metadata-configuration-path
type: concept
sources:
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx
    hash: 44fb021ae09c0e5998db5ba705db09cb4474182f21c8325355ff03338956176e
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts
    hash: 377e35f85ab80721d794200c748a7ac847550158b04b573114d0bcc5afeb5242
  - path: apps/platform/features/_map/datasets/upload/NewGriddedDataset.tsx
    hash: e581d4491c68d628157484ca566415d72c313a4e1da2a485457002737bebd523
  - path: apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx
    hash: d8ad34bee242a49bbd1765152c24cd50477f7941e3b8c5cb7d5ab88ad5385756
  - path: apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx
    hash: 320202a7474190245bbefedd8135759938ddf1bfb5c486709d11b092be3aa7ef
  - path: apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx
    hash: 76d1ff5cdb07bd33661dc9e21815e05276bea20812308321d1dcabc78c76253d
sources_digest: 9c9e8265b64a5c0ef90714fdc18b8ae2be18466a7eba751eaab8fa277e6fd2fe
links: []
generator:
  version: 1
covers:
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

Dataset configuration is geometry-type-specific, routed via DATASET_TYPE_TO_CONFIG_TYPE mapping. Each geometry (tracks, points, polygons, gridded) has a corresponding configuration type. During upload, user selections (property mappings, filters, aggregation mode) are written to the configuration object, which is then persisted in dataset metadata. Edit mode prevents reconfiguration of certain fields (e.g., polygon aggregation mode is locked after creation).
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
