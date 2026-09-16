# libs/deck-layers/src/layers/basemap/BasemapLayer.ts · [[basemap-layer-suite]]

- BaseMapLayerProps · type · L14-L14 — type BaseMapLayerProps = Omit<MVTLayerProps, 'data'> & _BasemapLayerProps
- BaseMapLayer · class · L18-L121 — class BaseMapLayer extends CompositeLayer<BaseMapLayerProps>
- initializeState · method · L24-L26 — initializeState(context: LayerContext): void
- _getBathimetryLayer · method · L28-L50 — _getBathimetryLayer()
- _getLandMassLayer · method · L52-L65 — _getLandMassLayer()
- _getSatelliteLayers · method · L67-L109 — _getSatelliteLayers(): LayersList
- _getBasemap · method · L111-L116 — _getBasemap(): LayersList
- renderLayers · method · L118-L120 — renderLayers(): LayersList
