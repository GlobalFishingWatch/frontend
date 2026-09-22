---
name: Coordinate and Date Parsing Utilities
slug: coordinate-and-date-parsing-utilities
type: concept
sources:
  - path: libs/data-transforms/src/points/points-to-geojson.ts
    hash: 1b4c3b45928ee6e3d2bd35214074ad03c1bc047230e8bcf737e69de45563dd0d
  - path: libs/data-transforms/src/schema/guess-columns.ts
    hash: 3de93a54a70ebee8b934e5ec8aa360412f3b8495168dbaa0415962e318af65d0
  - path: libs/data-transforms/src/schema/schema.ts
    hash: 6e1b471015d8bf44c404421a27ada9799c31fb14051bbfd709a0b724cd99966b
sources_digest: 494d7599af1a2b16d95dbd4b589a5c2706cd12b2dc0d982a085f4eeb023dc7aa
links:
  - to: filter-schema-inference-engine
    relation: part_of
    description: Validates coordinate and timestamp fields during filter type inference
  - to: points-to-geojson-transformation
    relation: part_of
    description: Core utilities used for point data validation and transformation
  - to: schema-detection-and-inference
    relation: part_of
    description: Used to validate data during automatic column type detection
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
  - symbol: GuessColumn
    kind: type
    at: 'libs/data-transforms/src/schema/guess-columns.ts:L4-L4'
  - symbol: VesselPropertyGuessColumn
    kind: type
    at: 'libs/data-transforms/src/schema/guess-columns.ts:L5-L5'
  - symbol: matchesWithUpperCase
    kind: function
    at: 'libs/data-transforms/src/schema/guess-columns.ts:L34-L40'
  - symbol: resolveVesselPropertyColumn
    kind: function
    at: 'libs/data-transforms/src/schema/guess-columns.ts:L58-L68'
  - symbol: guessColumn
    kind: function
    at: 'libs/data-transforms/src/schema/guess-columns.ts:L70-L72'
  - symbol: guessColumnsFromFilters
    kind: function
    at: 'libs/data-transforms/src/schema/guess-columns.ts:L74-L99'
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

Cross-cutting utilities for validating and transforming geographic coordinates and temporal values throughout the data-transforms library. parseCoords validates lat/lon coordinate tuples; getUTCDate converts various date formats to UTC timestamps; normalizePropertiesKeys applies snake_case normalization to object properties. These are used uniformly across schema inference, point transformation, and property sanitization to ensure consistent data types and ranges.

## Related

- part of [[filter-schema-inference-engine]] — Validates coordinate and timestamp fields during filter type inference
- part of [[points-to-geojson-transformation]] — Core utilities used for point data validation and transformation
- part of [[schema-detection-and-inference]] — Used to validate data during automatic column type detection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
