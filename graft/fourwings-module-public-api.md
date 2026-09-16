---
name: Fourwings Module Public API
slug: fourwings-module-public-api
type: file
sources:
  - path: libs/deck-layers/src/layers/fourwings/index.ts
    hash: 80dd7871deee18820eef45b7208daacee5772bed5e1aec99e6dc4a410716fe0f
sources_digest: c3d2eee6873e9ccdc0e743573ba8b3a2bfd3c5f0b552ab1bd8c6428957648859
links:
  - to: fourwings-heatmap-layer
    relation: depends_on
    description: Re-exports heatmap layer types and utilities
  - to: fourwings-positions-layer
    relation: depends_on
    description: Re-exports positions layer types and utilities
  - to: fourwings-vectors-layer
    relation: depends_on
    description: Re-exports vectors layer types and utilities
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Barrel export aggregating the entire Fourwings layer ecosystem: configuration (fourwings.config, fourwings.stats), types (fourwings.types, fourwings.utils), layer classes (FourwingsClustersLayer, FourwingsVectorsTileLayer, FourwingsLayer), and utilities (fourwings-heatmap.utils, fourwings-positions.utils). Provides a single entry point for consumers.

## Related

- depends on [[fourwings-heatmap-layer]] — Re-exports heatmap layer types and utilities
- depends on [[fourwings-positions-layer]] — Re-exports positions layer types and utilities
- depends on [[fourwings-vectors-layer]] — Re-exports vectors layer types and utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
