# libs/deck-layers/src/layers/user/UserPolygonsTileLayer.ts · [[color-and-configuration-management]] [[deck-gl-layer-foundation]] [[global-fishing-watch-api-integration]] [[user-layer-system]]

Module that defines the UserContextTileLayer class for rendering user-uploaded polygon tile layers with color scaling, filtering, highlighting, and MVT data support.

- _UserContextLayerProps · type · L40-L40 — Type alias combining TileLayer props with UserPolygons-specific props for layer configuration.
- UserPolygonsLayerState · type · L47-L51 — State type for UserContextTileLayer tracking color scale, viewport load status, and layer errors.
- UserContextTileLayer · class · L53-L336 — Main tile layer class that renders user polygons with support for color-mapped fill, filtering, and interactive highlighting.
- initializeState · method · L60-L72 — Initializes the scale function and viewport load state based on color ramp and step values.
- getError · method · L74-L76 — Returns the current error message from layer state.
- filtersHash · method · L78-L86 — Computes a hash of active sublayer filters for cache invalidation.
- aggregatedPropertyHash · method · L88-L96 — Computes a hash of aggregated property names across sublayers for cache invalidation.
- cacheHash · method · L98-L101 — Combines layer id, time bounds, and filter/property hashes into a single cache key.
- viewportLoaded · method · L103-L105 — Returns whether all viewport tiles have finished loading.
- updateState · method · L107-L132 — Recalculates the color scale and resets viewport load state when steps, colors, or data change.
- renderLayers · method · L226-L335 — Generates a set of GeoJsonLayers per sublayer for fill, outline, and highlight rendering with dynamic color and filter application.
