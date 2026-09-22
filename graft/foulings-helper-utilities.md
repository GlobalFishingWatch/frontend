---
name: Foulings Helper Utilities
slug: foulings-helper-utilities
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/helpers/index.ts
    hash: b6b805b0ea9398ddad60695cf2298926fa716722550f31958853e3c0ebee52ed
sources_digest: 340afad05ac8008bcf0089ed2a7e329d0c6c935bc7a232dd318493691fb92251
links:
  - to: byte-length-estimation
    relation: uses
    description: Re-exports byte length utilities
  - to: cell-geometry-helpers
    relation: uses
    description: Re-exports cell operation utilities
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

Aggregates low-level support modules for Fourwings parsing: byte-length (memory estimation), cells (geospatial grid operations), time (temporal interval conversion), and timestamps (frame-to-timestamp derivation and accumulation). Provides centralized contract for Fourwings loader utilities.

## Related

- uses [[byte-length-estimation]] — Re-exports byte length utilities
- uses [[cell-geometry-helpers]] — Re-exports cell operation utilities
- uses [[temporal-frame-conversion]] — Re-exports time interval helpers
- uses [[timestamp-frame-index-utilities]] — Re-exports timestamp and frame helpers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
