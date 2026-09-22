---
name: Fourwings Vector Loader
slug: fourwings-vector-loader
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.spec.ts
    hash: d955c06f53f1502448e75d65d6124012a37ae7f4fe99fbbda34cb1f709fb2366
  - path: libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts
    hash: fb61cf0d9eff65dbefbecd2fbaefa51e4e9e745fb41acf2bd79e819d1532c488
sources_digest: f09ef648d3e37415e115b5e094267f4b3533ee832ac4bb2428147811736526cd
links:
  - to: cell-geometry-helpers
    relation: uses
    description: Calls cell-level metadata and geometry utilities for feature construction
  - to: fourwings-heatmap-loader
    relation: uses
    description: Reuses descaleFourwingsValue for u/v component scaling
  - to: temporal-frame-conversion
    relation: uses
    description: Uses CONFIG_BY_INTERVAL to derive timestamps from tile frame offsets
generator:
  version: 1
covers:
  - symbol: VectorProcessingContext
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L29-L34'
  - symbol: processVectorValue
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L37-L45'
  - symbol: calculateVelocity
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L48-L60'
  - symbol: calculateDirection
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L63-L69'
  - symbol: processVectorComponents
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L72-L88'
  - symbol: getVectorContext
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L91-L98'
  - symbol: createTileBBox
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L101-L104'
  - symbol: CreateVectorFeatureParams
    kind: type
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L106-L115'
  - symbol: createFeature
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L118-L152'
  - symbol: getCellVectorValuesAggregated
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L154-L198'
  - symbol: getCellVectorValues
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L200-L303'
  - symbol: parseFourwingsVectors
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts:L305-L325'
---

<!-- context:generated:start -->

## Summary

Parses Protocol Buffer–encoded wind/meteorological vector data (u/v components) from Fourwings tiles into features with computed velocity and direction properties. Branches between aggregated (getCellVectorValuesAggregated) and temporal (getCellVectorValues) parsing modes, deriving velocity magnitude and direction (via atan2) with configurable unit conversion (knots/km/h/m/s). Stores no explicit timestamp array; timestamps are reconstructed from tile start frame plus relative offsets.

## Related

- uses [[cell-geometry-helpers]] — Calls cell-level metadata and geometry utilities for feature construction
- uses [[fourwings-heatmap-loader]] — Reuses descaleFourwingsValue for u/v component scaling
- uses [[temporal-frame-conversion]] — Uses CONFIG_BY_INTERVAL to derive timestamps from tile frame offsets

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
