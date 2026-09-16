# libs/deck-layers/src/layers/basemap/TilesBoundariesLayer.ts · [[basemap-layer-suite]]

TypeScript module that defines a composite deck.gl layer for rendering tile boundaries and debug information on a basemap.

- TilesBoundariesLayerProps · type · L25-L28 — Type definition for TilesBoundariesLayer props specifying a layer id and visualization mode for heatmap display.
- TilesBoundariesLayer · class · L30-L105 — Composite deck.gl layer class that renders tile boundaries and debug tile information (boundaries and coordinates) for fourwings heatmap tiles.
- renderLayers · method · L33-L104 — Renders a TileLayer with sub-layers displaying tile boundaries as colored paths and tile coordinates as text overlays based on visualization mode.
