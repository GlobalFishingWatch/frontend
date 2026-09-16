# libs/deck-layers/src/layers/user/UserPointsTileLayer.ts · [[color-and-configuration-management]] [[deck-gl-layer-foundation]] [[global-fishing-watch-api-integration]] [[temporal-filtering-architecture]] [[user-layer-system]]

Module that defines a tile-based layer for rendering user point data with filtering, radius scaling, and viewport management.

- _UserPointsLayerProps · type · L41-L41 — Type union combining tile layer and user-specific point layer configuration properties.
- GetUserPointsDataParams · type · L53-L56 — Type defining optional parameters for controlling temporal filtering and non-temporal feature inclusion in point data retrieval.
- UserPointsLayerState · type · L58-L62 — Type extending base layer state with error tracking, viewport load status, and a d3 scale function for radius mapping.
- UserPointsTileLayer · class · L63-L374 — Deck.gl tile layer that renders point features with dynamic radius scaling, temporal filtering, and property-based aggregation.
- initializeState · method · L70-L90 — Sets up the layer's initial state including error tracking and a square-root scale for mapping circle radius ranges.
- filtersHash · method · L92-L100 — Computes a cache key hash of all sublayer filters to track configuration changes.
- aggregatedPropertyHash · method · L102-L110 — Generates a cache key hash of aggregation properties across all sublayers.
- cacheHash · method · L112-L115 — Combines layer id, time bounds, filter state, and aggregation properties into a unique cache identifier.
- debounceTime · method · L117-L119 — Returns the configured debounce delay for state updates.
- viewportLoaded · method · L121-L123 — Accessor indicating whether tile data for the current viewport has finished loading.
- updateState · method · L130-L159 — Updates the scale function and viewport load status when radius range, point size, or data changes.
- getLayerInstance · method · L210-L213 — Retrieves the first rendered tile layer instance for accessing tileset data.
- getError · method · L215-L217 — Returns any error message from the most recent tile load operation.
- getColor · method · L288-L290 — Extracts the fill color configuration from the first sublayer.
- renderLayers · method · L299-L373 — Constructs tile and scatterplot layers applying filters, radius scaling, and highlight styling to render point data.
