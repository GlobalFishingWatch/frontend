---
name: Property Key Normalization
slug: property-key-normalization
type: concept
sources:
  - path: libs/data-transforms/src/points/points-to-geojson.ts
    hash: 1b4c3b45928ee6e3d2bd35214074ad03c1bc047230e8bcf737e69de45563dd0d
  - path: libs/data-transforms/src/schema/schema.ts
    hash: 6e1b471015d8bf44c404421a27ada9799c31fb14051bbfd709a0b724cd99966b
sources_digest: c5328462d0c0e786de5f7af87bbb5819dfc9893681772a07995cbdd66015a49c
links:
  - to: points-to-geojson-transformation
    relation: part_of
    description: Used to normalize point properties before filtering and type coercion
  - to: schema-detection-and-inference
    relation: part_of
    description: >-
      Applied during filter schema normalization to ensure canonical property
      names
generator:
  version: 1
covers:
  - symbol: cleanProperties
    kind: function
    at: 'libs/data-transforms/src/points/points-to-geojson.ts:L11-L31'
  - symbol: pointsListToGeojson
    kind: function
    at: 'libs/data-transforms/src/points/points-to-geojson.ts:L33-L77'
  - symbol: pointsGeojsonToNormalizedGeojson
    kind: function
    at: 'libs/data-transforms/src/points/points-to-geojson.ts:L79-L96'
  - symbol: GetFieldFilterParams
    kind: type
    at: 'libs/data-transforms/src/schema/schema.ts:L17-L20'
  - symbol: getFilterIdClean
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L27-L34'
  - symbol: normalizePropertiesKeys
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L36-L45'
  - symbol: getTimestampEnum
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L47-L53'
  - symbol: getFieldFilter
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L55-L127'
  - symbol: getDatasetFiltersClean
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L129-L136'
  - symbol: getDatasetConfigurationClean
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L148-L166'
  - symbol: getDatasetFiltersFromGeojson
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L168-L186'
  - symbol: ListedData
    kind: type
    at: 'libs/data-transforms/src/schema/schema.ts:L188-L188'
  - symbol: getDatasetFiltersFromList
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L189-L207'
  - symbol: getDatasetFilters
    kind: function
    at: 'libs/data-transforms/src/schema/schema.ts:L209-L219'
---

<!-- context:generated:start -->

## Summary

Consistent conversion of property keys to snake_case convention throughout the data-transforms library, applied during schema inference (getFilterIdClean), configuration normalization (getDatasetConfigurationClean with startTime/endTime/segmentId keys), and point property sanitization. Ensures downstream consumers receive properties in predictable canonical form regardless of source data casing or naming conventions.

## Related

- part of [[points-to-geojson-transformation]] — Used to normalize point properties before filtering and type coercion
- part of [[schema-detection-and-inference]] — Applied during filter schema normalization to ensure canonical property names

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
