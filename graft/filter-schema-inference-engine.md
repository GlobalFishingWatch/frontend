---
name: Filter Schema Inference Engine
slug: filter-schema-inference-engine
type: file
sources:
  - path: libs/data-transforms/src/schema/schema.ts
    hash: 6e1b471015d8bf44c404421a27ada9799c31fb14051bbfd709a0b724cd99966b
sources_digest: 4a92f25866202c124028cf3dff9fd2a81790380e91314e9dbb112d9229d87288
links:
  - to: coordinate-and-date-parsing-utilities
    relation: uses
    description: >-
      Validates coordinates and timestamps through parseCoords and date parsing
      utilities
  - to: schema-detection-and-inference
    relation: part_of
    description: >-
      Core engine for analyzing field values and transforming them into typed
      DatasetFilter objects
generator:
  version: 1
covers:
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

Infers DatasetFilter objects from raw data values, distinguishing between string, range, boolean, coordinate, and timestamp types with optional computed enums (unique values, min/max bounds, time ranges). Enforces MAX_FILTERS_ENUM_VALUES threshold (100) to prevent memory overhead, signaling the UI with a sentinel error message rather than expanding unbounded enum lists for high-cardinality fields.

## Related

- uses [[coordinate-and-date-parsing-utilities]] — Validates coordinates and timestamps through parseCoords and date parsing utilities
- part of [[schema-detection-and-inference]] — Core engine for analyzing field values and transforming them into typed DatasetFilter objects

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
