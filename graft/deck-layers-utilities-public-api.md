---
name: Deck Layers Utilities (Public API)
slug: deck-layers-utilities-public-api
type: system
sources:
  - path: libs/deck-layers/src/utils/index.ts
    hash: dc453883040c2c473ab31ddd72cc390e0b38ab7e6d21a0f10eba43b41413b93f
sources_digest: 46c3903a891e0c62dfc0afb3d12859e2340bbf014fc16320e1b464dd554bb59b
links:
  - to: color-format-conversion
    relation: uses
    description: Re-exports color conversion functions
  - to: color-ramps-palettes
    relation: uses
    description: Re-exports colorRamp functions
  - to: icon-sprite-mappings
    relation: uses
    description: Re-exports sprite sheet coordinate lookups
  - to: layer-positioning
    relation: uses
    description: Re-exports layer group offset calculation
  - to: temporal-utilities
    relation: uses
    description: Re-exports date and time helpers
  - to: viewport-hashing
    relation: uses
    description: Re-exports viewport change detection utility
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Public API barrel export aggregating pure utility functions (colorRamps, colors, dates, icons, sort, viewport) accessible via @globalfishingwatch/deck-layers/utils without full deck-layers dependencies. Enables granular imports and reduces bundle size for consumers needing only specific helpers.

## Related

- uses [[color-format-conversion]] — Re-exports color conversion functions
- uses [[color-ramps-palettes]] — Re-exports colorRamp functions
- uses [[icon-sprite-mappings]] — Re-exports sprite sheet coordinate lookups
- uses [[layer-positioning]] — Re-exports layer group offset calculation
- uses [[temporal-utilities]] — Re-exports date and time helpers
- uses [[viewport-hashing]] — Re-exports viewport change detection utility

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
