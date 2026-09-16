---
name: Fourwings Public API
slug: fourwings-public-api
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/index.ts
    hash: 9d4efbecbede1159baab4154c014daa94fb9c20be6039c1bbad31bc6ffe5fbde
sources_digest: bd3578e3587c091f3924212af75449929b424e2c449e92647bcec28619c34f32
links:
  - to: cell-geometry-helpers
    relation: uses
    description: Re-exports cell operation utilities
  - to: fourwings-loader-integration-deck-gl
    relation: uses
    description: Re-exports loader classes
  - to: temporal-frame-conversion
    relation: uses
    description: Re-exports time interval helpers
  - to: timestamp-frame-index-utilities
    relation: uses
    description: Re-exports timestamp and frame helpers
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Public barrel export aggregating Fourwings loaders and utilities. Re-exports FourwingsLoader, FourwingsWorkerLoader, FourwingsClustersLoader, FourwingsClustersWorkerLoader, FourwingsVectorsLoader, FourwingsVectorsWorkerLoader, along with helpers (descaleFourwingsValue, cell utilities, time functions) and types. Delegates specialized loading logic to separate loader modules while centralizing exports for a clean single-entry-point API.

## Related

- uses [[cell-geometry-helpers]] — Re-exports cell operation utilities
- uses [[fourwings-loader-integration-deck-gl]] — Re-exports loader classes
- uses [[temporal-frame-conversion]] — Re-exports time interval helpers
- uses [[timestamp-frame-index-utilities]] — Re-exports timestamp and frame helpers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
