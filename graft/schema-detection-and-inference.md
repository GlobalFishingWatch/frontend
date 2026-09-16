---
name: Schema Detection and Inference
slug: schema-detection-and-inference
type: system
sources:
  - path: libs/data-transforms/src/schema/guess-columns.ts
    hash: 3de93a54a70ebee8b934e5ec8aa360412f3b8495168dbaa0415962e318af65d0
  - path: libs/data-transforms/src/schema/index.ts
    hash: 1380d5b8722736066fa6c47ed5933025c9886f535a09bbecdb96e469708de753
  - path: libs/data-transforms/src/schema/schema.ts
    hash: 6e1b471015d8bf44c404421a27ada9799c31fb14051bbfd709a0b724cd99966b
sources_digest: 70253a32b4d6dfae08390a9aa0b396b9adfa84e811ab055a0498509ff7254f92
links:
  - to: coordinate-and-date-parsing-utilities
    relation: uses
    description: >-
      parseCoords and getUTCDate are used to validate column data during schema
      inference
  - to: dataset-configuration-and-filtering
    relation: depends_on
    description: >-
      Uses getFlattenDatasetFilters to process nested filter structures before
      column matching, and depends on dataset filter types from api-types
  - to: property-key-normalization
    relation: uses
    description: >-
      normalizePropertiesKeys and GUESS_COLUMN_DICT for standardizing column
      naming conventions
generator:
  version: 1
covers:
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

Automatically identifies geographic, temporal, and vessel identifier columns in datasets through multilingual alias matching and regex-based fallback strategies. Implements a two-phase matching strategy: exact matches against canonical aliases first, then regex-based approximate matching for inconsistently named columns. Handles both single columns and nested filter structures from the backend.

## Related

- uses [[coordinate-and-date-parsing-utilities]] — parseCoords and getUTCDate are used to validate column data during schema inference
- depends on [[dataset-configuration-and-filtering]] — Uses getFlattenDatasetFilters to process nested filter structures before column matching, and depends on dataset filter types from api-types
- uses [[property-key-normalization]] — normalizePropertiesKeys and GUESS_COLUMN_DICT for standardizing column naming conventions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
