# libs/deck-layers/src/layers/pm-tiles/PMTilesLayer.ts · [[pmtiles-layer]]

Module that defines PMTilesLayer, a custom deck.gl layer for rendering PMTiles vector tile data sources.

- PMTilesLayerState · type · L9-L11 — Type that extends the base TileLayer state with a tileSource property to hold the loaded PMTiles data source.
- PMTilesLayer · class · L13-L51 — Custom deck.gl TileLayer subclass that wraps PMTiles vector tile sources and manages their lifecycle.
- initializeState · method · L17-L22 — Initializes the layer state with a tileSource created from the data prop URL.
- updateState · method · L24-L35 — Handles updates to the layer state when the data prop changes by recreating the tile source.
- createTileSource · method · L37-L42 — Instantiates a PMTiles data source from a URL using the loaders.gl framework.
- getTileData · method · L44-L50 — Fetches tile data from the PMTiles source, returning null if no source is available.
