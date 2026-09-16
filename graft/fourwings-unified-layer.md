---
name: Fourwings Unified Layer
slug: fourwings-unified-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/fourwings/fourwings.types.ts
    hash: 6082c02885f397bc52f4a98b649f02a604c2593c4ad0311272769e88e2a1550a
  - path: libs/deck-layers/src/layers/fourwings/FourwingsLayer.spec.ts
    hash: bf7be4291252ee29777bd18211790579e4d5483b83b7db9642c4e26dc826b1c8
  - path: libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts
    hash: 05df067b4146356879f70d595a88a01422bd73035b24e58b36c30c52e041a603
sources_digest: 7097ba40d7e83263143476368a1df5140178c1a1d79e5c540c34e0acdb204f89
links:
  - to: deck-gl-core-integration
    relation: depends_on
    description: >-
      Extends CompositeLayer; manages cacheHash composition and safe defaults
      for highlighted features/times
  - to: fourwings-clustering-layer
    relation: uses
    description: >-
      Instantiates FourwingsClustersLayer as sublayer in certain visualization
      modes
  - to: fourwings-footprint-layer
    relation: uses
    description: Instantiates FourwingsFootprintTileLayer for footprint visualization mode
  - to: fourwings-heatmap-layer
    relation: uses
    description: >-
      Instantiates FourwingsHeatmapTileLayer and FourwingsHeatmapStaticLayer
      based on static flag and visualization mode
generator:
  version: 1
covers:
  - symbol: renderSubLayer
    kind: function
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.spec.ts:L43-L47'
  - symbol: HighlightedTimeMillis
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L31-L31'
  - symbol: FourwingsLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L33-L37'
  - symbol: FourwingsColorRamp
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L39-L42'
  - symbol: FourwingsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L44-L55'
  - symbol: AnyFourwingsLayer
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L57-L61'
  - symbol: FourwingsLayer
    kind: class
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L68-L254'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L73-L78'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L80-L82'
  - symbol: isHeatmapVisualizationMode
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L84-L90'
  - symbol: debounceTime
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L92-L94'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L96-L98'
  - symbol: _getHighlightTimes
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L100-L105'
  - symbol: setHighlightedTime
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L107-L115'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L117-L161'
  - symbol: setHighlightedVessel
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L163-L168'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L170-L175'
  - symbol: getData
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L177-L179'
  - symbol: getError
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L181-L183'
  - symbol: getIsPositionsAvailable
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L185-L194'
  - symbol: getInterval
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L196-L201'
  - symbol: getVisualizationMode
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L203-L205'
  - symbol: getAggregationOperation
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L207-L209'
  - symbol: getChunk
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L211-L216'
  - symbol: getViewportData
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L218-L220'
  - symbol: getMode
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L222-L224'
  - symbol: getResolution
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L226-L228'
  - symbol: getZoomOffset
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L230-L237'
  - symbol: getLayer
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L239-L241'
  - symbol: getColorScale
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L243-L245'
  - symbol: getColorByValue
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L247-L249'
  - symbol: getFourwingsLayers
    kind: method
    at: 'libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts:L251-L253'
  - symbol: FourwingsSublayerId
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L17-L17'
  - symbol: FourwingsDatasetId
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L18-L18'
  - symbol: FourwingsVisualizationMode
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L19-L19'
  - symbol: GetViewportDataParams
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L21-L23'
  - symbol: FourwingsColorObject
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L25-L25'
  - symbol: FourwingsTileLayerColorDomain
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L26-L26'
  - symbol: FourwingsTileLayerColorRange
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L27-L27'
  - symbol: FourwingsTileLayerColorScale
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L28-L31'
  - symbol: FourwingsDeckSublayer
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L33-L51'
  - symbol: FourwingsVectorDirection
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L53-L53'
  - symbol: FourwingsDeckVectorSublayer
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L54-L62'
  - symbol: BaseFourwingsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L64-L73'
  - symbol: FourwingsPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L75-L75'
  - symbol: FourwingsPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/fourwings/fourwings.types.ts:L76-L78'
---

<!-- context:generated:start -->

## Summary

Composite facade layer that dynamically instantiates specialized sublayers (FourwingsPositionsTileLayer, FourwingsHeatmapTileLayer, FourwingsFootprintTileLayer, FourwingsHeatmapStaticLayer) based on visualization mode and resolution. Exposes unified interface for querying data, highlights, and color scales while delegating state management to active sublayer. Supports lazy resolution selection and conditional sublayer instantiation for extensibility.

## Related

- depends on [[deck-gl-core-integration]] — Extends CompositeLayer; manages cacheHash composition and safe defaults for highlighted features/times
- uses [[fourwings-clustering-layer]] — Instantiates FourwingsClustersLayer as sublayer in certain visualization modes
- uses [[fourwings-footprint-layer]] — Instantiates FourwingsFootprintTileLayer for footprint visualization mode
- uses [[fourwings-heatmap-layer]] — Instantiates FourwingsHeatmapTileLayer and FourwingsHeatmapStaticLayer based on static flag and visualization mode

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
