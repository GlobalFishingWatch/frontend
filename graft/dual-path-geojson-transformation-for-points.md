---
name: Dual-Path GeoJSON Transformation for Points
slug: dual-path-geojson-transformation-for-points
type: concept
sources:
  - path: apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts
    hash: e1d1529faf3dd1869bc953ed7a616fa229cba12686b125e55dfbd1de786c5427
  - path: apps/platform/features/_map/datasets/upload/NewPointsDataset.tsx
    hash: d8ad34bee242a49bbd1765152c24cd50477f7941e3b8c5cb7d5ab88ad5385756
sources_digest: d187da913bc2549fc090cbd715a4b62eccf1de15ad1bd7848d851558a7695c55
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

Point dataset upload supports two input formats: CSV files (with latitude/longitude columns) flow through getGeojsonFromPointsList, while GeoJSON files use getNormalizedGeojsonFromPointsGeojson. Both are reactive—changing latitude/longitude/time field metadata triggers async regeneration of GeoJSON, allowing real-time preview updates. On confirmation, the final GeoJSON is serialized and validated for size limits.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
