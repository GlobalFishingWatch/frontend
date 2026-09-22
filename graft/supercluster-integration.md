---
name: Supercluster Integration
slug: supercluster-integration
type: concept
sources:
  - path: libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts
    hash: bd1dcdd246a92d949a17e0d2b03419405c3412dcea2da69740fad378d81c4176
sources_digest: 9ae501941950285d6a2be88b86b7001eab1f04073b3b42ff5120f088295a1612
links:
  - to: deck-gl-core-integration
    relation: uses
    description: >-
      Uses Supercluster cluster objects with ScatterplotLayer and IconLayer for
      rendering; integrates with d3-scale for radius scaling
generator:
  version: 1
covers:
  - symbol: FourwingsClustersTileLayerState
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L66-L76
  - symbol: SuperclusterIndex
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L113-L116
  - symbol: getClusterIndexSize
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L118-L122
  - symbol: getFourwingsGeolocation
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L124-L139
  - symbol: FourwingsClustersLayer
    kind: class
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L141-L591
  - symbol: cacheHash
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L148-L150
  - symbol: clusterMode
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L152-L160
  - symbol: interval
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L162-L164
  - symbol: getError
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L166-L168
  - symbol: initializeState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L170-L186
  - symbol: _getHighlightedFeatures
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L188-L190
  - symbol: updateState
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L199-L226
  - symbol: renderLayers
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L488-L562
  - symbol: getData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L564-L566
  - symbol: setHighlightedFeatures
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L568-L575
  - symbol: getViewportData
    kind: method
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts:L577-L590
---

<!-- context:generated:start -->

## Summary

Client-side spatial clustering using the Supercluster library with adaptive radius scaling. Recalculates only when zoom changes ≥1 level to minimize thrashing. Migrated from older Supercluster behavior (which stored .points) to v9 (which does not), requiring tracking of numPoints separately and using getLeaves() for feature retrieval. Supports zoom-level-driven drill-down with expansionBounds metadata.

## Related

- uses [[deck-gl-core-integration]] — Uses Supercluster cluster objects with ScatterplotLayer and IconLayer for rendering; integrates with d3-scale for radius scaling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
