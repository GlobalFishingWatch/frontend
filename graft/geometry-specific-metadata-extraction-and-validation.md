---
name: Geometry-Specific Metadata Extraction and Validation
slug: geometry-specific-metadata-extraction-and-validation
type: concept
sources:
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
sources_digest: 154aee235bbb69f9c4835fdbdc5bba69fb4ffdbbea3d898a32aabc0f50ad14c3
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

Each geometry type (tracks, points, polygons, gridded) has a dedicated metadata factory function (getTracksDatasetMetadata, etc.) that infers columns, configures geometry handling, and validates required fields. Track upload enforces lineId/segmentId presence; points require latitude/longitude; polygons validate temporal fields against feature properties. Validation gates the confirm button via getDatasetMetadataValidations, and errors are displayed inline to guide user corrections.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
