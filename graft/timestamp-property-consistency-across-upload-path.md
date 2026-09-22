---
name: Timestamp Property Consistency Across Upload Path
slug: timestamp-property-consistency-across-upload-path
type: concept
sources:
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts
    hash: 377e35f85ab80721d794200c748a7ac847550158b04b573114d0bcc5afeb5242
  - path: apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx
    hash: d8ad34bee242a49bbd1765152c24cd50477f7941e3b8c5cb7d5ab88ad5385756
  - path: apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx
    hash: 320202a7474190245bbefedd8135759938ddf1bfb5c486709d11b092be3aa7ef
  - path: apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx
    hash: 76d1ff5cdb07bd33661dc9e21815e05276bea20812308321d1dcabc78c76253d
  - path: apps/platform/features/_map/datasets/upload/TimeFieldsGroup.tsx
    hash: 1c65502394574e9f0b58476c9b106fae9c2c83dee8c001591cde6ca6d748c83a
sources_digest: 064afa24a304c6d5d9cdb9c2a0aef403bec2e867c1fcda4e951643536a21b55f
links: []
generator:
  version: 1
covers:
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

Timestamp fields are handled consistently across CSV and GeoJSON paths: getGeoJsonProperties normalizes GeoJSON features by converting timestamp values to milliseconds, while dataset-upload.utils validates that explicit column mappings match actual data. Dataset date bounds are computed as ISO strings. Filters for timestamp range validation must be explicitly configured via TimeFieldsGroup, and validation errors (timeFilterError) are displayed to guide correction.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
