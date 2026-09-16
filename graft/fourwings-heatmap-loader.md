---
name: Fourwings Heatmap Loader
slug: fourwings-heatmap-loader
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/lib/parse-fourwings.spec.ts
    hash: 55564e8cba0b47328f644563d0c9b0584bb40fae2e631c5446d957820a739d5b
  - path: libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts
    hash: ff619edc49e3769317a98eaa798ab2730fa677a1b2eacd5990d5e7904a0eb581
sources_digest: 076924768ede9c2dd0f9102cb9071caa61c3347f65a5b8c4e627b00fd7316ec7
links:
  - to: cell-geometry-helpers
    relation: uses
    description: >-
      Calls getCellCoordinates and getCellProperties to build feature geometries
      from cell indices
  - to: fourwings-data-types
    relation: implements
    description: >-
      Produces FourwingsFeature objects matching the contract defined in
      types.ts
  - to: temporal-frame-conversion
    relation: uses
    description: >-
      Uses CONFIG_BY_INTERVAL and getTimeRangeKey to convert frame indices to
      timestamps and keys
generator:
  version: 1
covers:
  - symbol: aggregatedOptions
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.spec.ts:L169-L181'
  - symbol: isFourwingsNoDataValue
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L15-L17'
  - symbol: descaleFourwingsValue
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L23-L29'
  - symbol: getCellTimeseries
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L36-L178'
  - symbol: getCellTemporalAggregated
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L184-L258'
  - symbol: parseFourwings
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts:L260-L277'
---

<!-- context:generated:start -->

## Summary

Parses Protocol Buffer–encoded 4wings geospatial timeseries raster data into GeoJSON features with temporal properties. Handles both multi-frame detailed temporal data (via getCellTimeseries) and pre-aggregated single-value snapshots (via getCellTemporalAggregated), applying per-sublayer scale/offset transformations and filtering no-data sentinels. Streams varint parsing to avoid per-cell allocations and derives timestamps on-the-fly from frame indices.

## Related

- uses [[cell-geometry-helpers]] — Calls getCellCoordinates and getCellProperties to build feature geometries from cell indices
- implements [[fourwings-data-types]] — Produces FourwingsFeature objects matching the contract defined in types.ts
- uses [[temporal-frame-conversion]] — Uses CONFIG_BY_INTERVAL and getTimeRangeKey to convert frame indices to timestamps and keys

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
