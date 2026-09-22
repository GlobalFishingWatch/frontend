---
name: Fourwings Clustering Layer
slug: fourwings-clustering-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts
    hash: b48d0bfc239f82809d6cc85b70aad6a4fc3e4dfa4a12ef3aa0f1e5b4c9584611
  - path: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.spec.ts
    hash: 05b9c27c649007f2d5bf3055958c8540071124249b5f9b31c9e5c7a1fc644d6e
  - path: libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts
    hash: bd1dcdd246a92d949a17e0d2b03419405c3412dcea2da69740fad378d81c4176
sources_digest: 81a409d0c16c79e944ac81d2b08973315fb8d5f6f9861d4c88bbd1ec412d601d
links:
  - to: deck-gl-core-integration
    relation: uses
    description: >-
      Extends CompositeLayer; uses IconLayer, ScatterplotLayer, and TextLayer
      for rendering; applies ScalePower scaling via d3-scale
  - to: fourwings-data-infrastructure
    relation: depends_on
    description: >-
      Depends on FourwingsClustersLoader for parsing 4WINGS tile formats; uses
      GFWAPI for position data fetches and deck-loaders (getFourwingsInterval)
      for temporal data handling
  - to: supercluster-integration
    relation: uses
    description: >-
      Uses Supercluster for in-browser clustering with adaptive radius scaling
      (MIN_CLUSTER_RADIUS 12px to MAX_CLUSTER_RADIUS 30px) and expansion bounds
      for zoom-driven drill-down
generator:
  version: 1
covers:
  - symbol: point
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.spec.ts:L21-L36
  - symbol: makeLayer
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.spec.ts:L46-L51
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
  - symbol: FourwingsClusterEventType
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L14-L20
  - symbol: FourwingsClusterMode
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L22-L22
  - symbol: FourwingsClustersLayerProps
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L24-L35
  - symbol: FourwingsClusterProperties
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L37-L47
  - symbol: FourwingsClusterFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L48-L48
  - symbol: FourwingsPointFeature
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L50-L50
  - symbol: FourwingsClusterPickingObject
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L51-L61
  - symbol: FourwingsClusterPickingInfo
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts:L63-L66
---

<!-- context:generated:start -->

## Summary

Visualizes Fourwings fisheries event data (encounters, gaps, ports, loitering) with client-side Supercluster clustering that switches between clustered markers and individual points based on zoom level. Recalculates clustering only when zoom changes by ≥1 level; enforces MAX_INDIVIDUAL_POINTS threshold (1000) beyond which clustering forces. Couples cluster properties with tile metadata (column, row, tile index) for efficient drill-down.

## Related

- uses [[deck-gl-core-integration]] — Extends CompositeLayer; uses IconLayer, ScatterplotLayer, and TextLayer for rendering; applies ScalePower scaling via d3-scale
- depends on [[fourwings-data-infrastructure]] — Depends on FourwingsClustersLoader for parsing 4WINGS tile formats; uses GFWAPI for position data fetches and deck-loaders (getFourwingsInterval) for temporal data handling
- uses [[supercluster-integration]] — Uses Supercluster for in-browser clustering with adaptive radius scaling (MIN_CLUSTER_RADIUS 12px to MAX_CLUSTER_RADIUS 30px) and expansion bounds for zoom-driven drill-down

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
