---
name: Points to GeoJSON Transformation
slug: points-to-geojson-transformation
type: system
sources:
  - path: libs/data-transforms/src/points/points-to-geojson.ts
    hash: 1b4c3b45928ee6e3d2bd35214074ad03c1bc047230e8bcf737e69de45563dd0d
sources_digest: 3df2a89671a24aebfe04585ca8f14bc73c55a27dfd6bbdf64b550df1d11e98a9
links:
  - to: coordinate-and-date-parsing-utilities
    relation: uses
    description: >-
      Depends on parseCoords, getUTCDate, and normalizePropertiesKeys for
      coordinate validation, date parsing, and property normalization
  - to: dataset-configuration-and-filtering
    relation: uses
    description: >-
      Uses getFlattenDatasetFilters from datasets-client to flatten nested
      filter definitions for property type coercion
  - to: property-key-normalization
    relation: uses
    description: >-
      Normalizes property keys to snake_case conventions before filtering and
      transformation
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
---

<!-- context:generated:start -->

## Summary

Converts raw point data with latitude/longitude columns into GeoJSON Features with property sanitization and timestamp parsing. Tracks parsing failures via hasDatesError metadata to enable partial data ingestion without stopping transformation. Filters invalid numeric properties that fail NaN checks for coordinate and range types.

## Related

- uses [[coordinate-and-date-parsing-utilities]] — Depends on parseCoords, getUTCDate, and normalizePropertiesKeys for coordinate validation, date parsing, and property normalization
- uses [[dataset-configuration-and-filtering]] — Uses getFlattenDatasetFilters from datasets-client to flatten nested filter definitions for property type coercion
- uses [[property-key-normalization]] — Normalizes property keys to snake_case conventions before filtering and transformation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
