---
name: Fourwings Cluster Loader
slug: fourwings-cluster-loader
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.spec.ts
    hash: 6671e24fe5882e9bc5663d3ad156f39d497be1b3766d691e58d3ffae9adc4d89
  - path: libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.ts
    hash: 2d359ab863455e918b20e35b6626c0f5d26c80291856311679fbc6dad7dfe80d
sources_digest: 120b2bab723e0df58f19e9d20c5573957e1757e515b7ea4d65afa941591f16a5
links:
  - to: cell-geometry-helpers
    relation: uses
    description: >-
      Calls getCellBounds and getCellPointCoordinates for feature geometry
      construction
  - to: fourwings-heatmap-loader
    relation: uses
    description: Reuses descaleFourwingsValue and no-data handling from heatmap parser
  - to: temporal-frame-conversion
    relation: uses
    description: >-
      Uses CONFIG_BY_INTERVAL to convert frame indices to timestamps in temporal
      mode
generator:
  version: 1
covers:
  - symbol: createMockTileBBox
    kind: function
    at: >-
      libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.spec.ts:L11-L20
  - symbol: createClustersOptions
    kind: function
    at: >-
      libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.spec.ts:L22-L34
  - symbol: getPointsTemporalAggregated
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.ts:L32-L95'
  - symbol: getPoints
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.ts:L97-L175'
  - symbol: readData
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.ts:L177-L179'
  - symbol: parseFourwingsClusters
    kind: function
    at: 'libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.ts:L181-L189'
---

<!-- context:generated:start -->

## Summary

Decodes Fourwings cluster data (aggregated cell statistics) from Protocol Buffer buffers into GeoJSON point features. Routes between temporal (getPoints) and non-temporal (getPointsTemporalAggregated) parsing paths based on temporalAggregation flag, applying scale/offset transformations and filtering no-data values. Reuses cell geometry helpers and value descaling utilities from the parent heatmap parser.

## Related

- uses [[cell-geometry-helpers]] — Calls getCellBounds and getCellPointCoordinates for feature geometry construction
- uses [[fourwings-heatmap-loader]] — Reuses descaleFourwingsValue and no-data handling from heatmap parser
- uses [[temporal-frame-conversion]] — Uses CONFIG_BY_INTERVAL to convert frame indices to timestamps in temporal mode

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
