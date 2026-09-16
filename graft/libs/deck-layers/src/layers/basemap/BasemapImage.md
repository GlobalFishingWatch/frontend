# libs/deck-layers/src/layers/basemap/BasemapImage.ts · [[basemap-layer-suite]]

Module that exports a composite layer component for rendering basemap image tiles using PMTiles format.

- BaseMapImageLayerProps · type · L10-L14 — Type definition specifying the configuration properties for the basemap image layer, extending MVT layer properties with tile URL and rendering parameters.
- BaseMapImageLayer · class · L16-L53 — Composite layer class that renders raster basemap tiles from a PMTiles source as bitmap imagery on the map.
- initializeState · method · L24-L26 — Hook that initializes the layer state by delegating to the parent CompositeLayer.
- renderLayers · method · L28-L52 — Method that creates a PMTilesLayer configured to render basemap image tiles as bitmap layers with proper coordinate bounds and offset.
