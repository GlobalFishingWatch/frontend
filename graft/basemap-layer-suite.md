---
name: Basemap Layer Suite
slug: basemap-layer-suite
type: system
sources:
  - path: libs/deck-layers/src/layers/basemap/basemap.types.ts
    hash: 90d47cb16aa1779fd9a6a33db96d21d276bd10696e7f424037af9cde4b62d6f0
  - path: libs/deck-layers/src/layers/basemap/BasemapImage.ts
    hash: 1f1c3338ad02d554a1e7dbd1710f23acd88fe36b4fa56fdf08025f98a96464d5
  - path: libs/deck-layers/src/layers/basemap/BasemapLabelsLayer.ts
    hash: dc8e7d2e077bd80cd7ce08b6ef8738fffeb9458353aef85fe2a321db8b076d35
  - path: libs/deck-layers/src/layers/basemap/BasemapLayer.ts
    hash: 621de46e809047777f3b99fcca441c64812ba350d4834ba2d75915f9303307c9
  - path: libs/deck-layers/src/layers/basemap/index.ts
    hash: c5ddecbfda11b770752a547a5e9a1b02440c363c3979eb283adb99df3ab95e64
  - path: libs/deck-layers/src/layers/basemap/TilesBoundariesLayer.ts
    hash: 140a16fb1218195c995d60cb68f679a8cc00af9ed70996e0f5088bd4826bfb3b
sources_digest: 7b341734cfabf30ab759f923cdda48aac70fbd15eaf5935cf3fdd65b917a1b62
links:
  - to: api-integration-and-data-loading
    relation: depends_on
    description: >-
      Basemap layers source tile data from PMTiles and TileLayer, which rely on
      API integration utilities
  - to: layer-type-and-configuration-system
    relation: depends_on
    description: >-
      Uses LayerGroup configuration for z-order positioning and
      SATELLITE_SWITCH_ZOOM threshold
  - to: tile-coordinate-system
    relation: uses
    description: >-
      BasemapLayer and TilesBoundariesLayer use tile transformation utilities
      for proper geographic rendering
generator:
  version: 1
covers:
  - symbol: BaseMapImageLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/BasemapImage.ts:L10-L14'
  - symbol: BaseMapImageLayer
    kind: class
    at: 'libs/deck-layers/src/layers/basemap/BasemapImage.ts:L16-L53'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapImage.ts:L24-L26'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapImage.ts:L28-L52'
  - symbol: BaseMapLabelsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/BasemapLabelsLayer.ts:L16-L16'
  - symbol: BaseMapLabelsLayer
    kind: class
    at: 'libs/deck-layers/src/layers/basemap/BasemapLabelsLayer.ts:L18-L90'
  - symbol: _getColor
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLabelsLayer.ts:L24-L34'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLabelsLayer.ts:L36-L89'
  - symbol: BaseMapLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L14-L14'
  - symbol: BaseMapLayer
    kind: class
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L18-L121'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L24-L26'
  - symbol: _getBathimetryLayer
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L28-L50'
  - symbol: _getLandMassLayer
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L52-L65'
  - symbol: _getSatelliteLayers
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L67-L109'
  - symbol: _getBasemap
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L111-L116'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/BasemapLayer.ts:L118-L120'
  - symbol: TilesBoundariesLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/TilesBoundariesLayer.ts:L25-L28'
  - symbol: TilesBoundariesLayer
    kind: class
    at: 'libs/deck-layers/src/layers/basemap/TilesBoundariesLayer.ts:L30-L105'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/basemap/TilesBoundariesLayer.ts:L33-L104'
  - symbol: BasemapType
    kind: enum
    at: 'libs/deck-layers/src/layers/basemap/basemap.types.ts:L7-L11'
  - symbol: BasemapLayerProperties
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/basemap.types.ts:L13-L23'
  - symbol: BasemapLayerFeature
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/basemap.types.ts:L24-L24'
  - symbol: _BasemapLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/basemap.types.ts:L25-L25'
  - symbol: _BasemapLabelsLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/basemap/basemap.types.ts:L26-L26'
---

<!-- context:generated:start -->

## Summary

Provides composite deck.gl layers for rendering satellite imagery, terrain, cartographic labels, and tile grid boundaries via PMTiles and TileLayer sources.

## Related

- depends on [[api-integration-and-data-loading]] — Basemap layers source tile data from PMTiles and TileLayer, which rely on API integration utilities
- depends on [[layer-type-and-configuration-system]] — Uses LayerGroup configuration for z-order positioning and SATELLITE_SWITCH_ZOOM threshold
- uses [[tile-coordinate-system]] — BasemapLayer and TilesBoundariesLayer use tile transformation utilities for proper geographic rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
