---
name: Byte Length Estimation
slug: byte-length-estimation
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/helpers/byte-length.spec.ts
    hash: 9da3bf4c378821cb574562e24f1db181b5824169deae714fd615718f8dba8cc8
  - path: libs/deck-loaders/src/fourwings/helpers/byte-length.ts
    hash: f1acf6c7ce85e83ad9317471d4d13d03737c4a766be0414532873ece3de78440
sources_digest: ebc2b40c255e122a21708053e1129d1b83ac5b36b65d87ffc5b38203fe150912
links:
  - to: fourwings-data-types
    relation: depends_on
    description: Operates on FourwingsFeature type
generator:
  version: 1
covers:
  - symbol: createFeature
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/byte-length.spec.ts:L10-L20'
  - symbol: estimateFourwingsFeaturesByteLength
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/byte-length.ts:L8-L25'
  - symbol: assignFourwingsFeaturesByteLength
    kind: function
    at: 'libs/deck-loaders/src/fourwings/helpers/byte-length.ts:L27-L34'
---

<!-- context:generated:start -->

## Summary

Estimates and tracks heap memory consumption for Fourwings GeoJSON features to support deck.gl's Tileset2D cache management. Exports estimateFourwingsFeaturesByteLength (sums fixed 250-byte overhead per feature plus 8 bytes per numeric value in values/velocities/directions arrays) and assignFourwingsFeaturesByteLength (attaches computed estimate to feature.byteLength as enumerable property for structured cloning). Uses conservative estimates (all numbers assumed 8-byte) and may diverge from actual V8 heap layout.

## Related

- depends on [[fourwings-data-types]] — Operates on FourwingsFeature type

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
