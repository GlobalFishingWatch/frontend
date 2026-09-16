---
name: Asynchronous File Type Detection
slug: asynchronous-file-type-detection
type: concept
sources:
  - path: apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts
    hash: e1d1529faf3dd1869bc953ed7a616fa229cba12686b125e55dfbd1de786c5427
  - path: apps/platform/features/_map/datasets/upload/NewGriddedDataset.tsx
    hash: e581d4491c68d628157484ca566415d72c313a4e1da2a485457002737bebd523
  - path: apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx
    hash: d8ad34bee242a49bbd1765152c24cd50477f7941e3b8c5cb7d5ab88ad5385756
  - path: apps/platform/features/_map/datasets/upload/NewPolygonDataset.tsx
    hash: 320202a7474190245bbefedd8135759938ddf1bfb5c486709d11b092be3aa7ef
  - path: apps/platform/features/_map/datasets/upload/NewTrackDataset.tsx
    hash: 76d1ff5cdb07bd33661dc9e21815e05276bea20812308321d1dcabc78c76253d
sources_digest: 6439706adb338884d8603cd275308b21015fe1dd025fc875dcd949b695383e0c
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
---

<!-- context:generated:start -->

## Summary

Multi-step geospatial upload workflow defers file type detection to async effects that run after user selection. Detection unzips archives (if needed), inspects file headers, and resolves format (shapefile, CSV, KML, GeoJSON, NetCDF, GeoTIFF). Parsing happens only after detection succeeds, with processingData flag blocking form interaction during detection/parsing. Failed detection is communicated via onDatasetParseError callback.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
