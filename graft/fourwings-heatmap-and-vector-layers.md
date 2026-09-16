---
name: Fourwings Heatmap and Vector Layers
slug: fourwings-heatmap-and-vector-layers
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/fourwings.ts
    hash: b951f7b683df8a07f4ac314ab028ab68e0bdb56003a861924155d47ba3aa275b
  - path: libs/deck-layer-composer/src/resolvers/vectors.ts
    hash: 95d2380d06bf8cb614d482a89f87d6b75c8e3930b50db81c714b1042c4687382
sources_digest: 618317f945def0092459f8bbf56977dae84b94235cf584fad01fc1bea68b77d5
links:
  - to: dataset-client
    relation: uses
    description: >-
      Resolvers call resolveEndpoint and datasets-client for tile URL
      construction and dataset metadata
  - to: layer-type-and-configuration-system
    relation: depends_on
    description: >-
      Uses FourwingsAggregationOperation, FourwingsComparisonMode, and color
      ramp configuration
  - to: temporal-metadata-extraction
    relation: uses
    description: >-
      Resolvers call getDataviewAvailableIntervals to determine supported time
      ranges for heatmap visualization
generator:
  version: 1
covers:
  - symbol: resolveDeckFourwingsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/fourwings.ts:L36-L208'
  - symbol: resolveDeckVectorsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vectors.ts:L14-L84'
---

<!-- context:generated:start -->

## Summary

Renders aggregated activity and detection heatmaps via tile-based Fourwings datasets, supporting multiple visualization modes (standard, high-res, low-res), time comparison, and vector field visualization with configurable color ramps and aggregation strategies.

## Related

- uses [[dataset-client]] — Resolvers call resolveEndpoint and datasets-client for tile URL construction and dataset metadata
- depends on [[layer-type-and-configuration-system]] — Uses FourwingsAggregationOperation, FourwingsComparisonMode, and color ramp configuration
- uses [[temporal-metadata-extraction]] — Resolvers call getDataviewAvailableIntervals to determine supported time ranges for heatmap visualization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
