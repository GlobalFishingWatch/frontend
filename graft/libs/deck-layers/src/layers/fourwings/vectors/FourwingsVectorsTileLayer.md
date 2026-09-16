# libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsTileLayer.ts · [[deck-gl-composite-layer-pattern]] [[dynamic-color-ramping]] [[fourwings-vectors-layer]] [[temporal-aggregation-caching]]

Module that implements a composite tile layer for rendering fourwings vector data with temporal aggregation support.

- FourwingsVectorsTileLayerState · type · L52-L59 — State type that holds the tile cache, velocity bounds, error status, and highlighted features for the vectors layer.
- _FourwingsVectorsTileLayerProps · type · L63-L72 — Base props type for the vectors tile layer combining fourwings configuration with sublayer and temporal aggregation options.
- FourwingsVectorsTileLayerProps · type · L75-L76 — Complete props type combining base fourwings vector props with deck.gl TileLayer options.
- FourwingsVectorsTileLayer · class · L85-L501 — CompositeLayer that manages tiled vector data rendering with dynamic velocity ramp scaling and temporal data aggregation.
- initializeState · method · L93-L110 — Initializes layer state with tile cache, velocity bounds, and error tracking.
- _getHighlightedFeatures · method · L112-L114 — Returns the currently highlighted features or an empty array as fallback.
- setHighlightedFeatures · method · L116-L121 — Updates the state with newly highlighted features for visual emphasis.
- cacheHash · method · L123-L127 — Generates a unique hash key from layer props, colors, and state to invalidate cache on changes.
- debounceTime · method · L129-L131 — Retrieves the debounce time configuration with zero as default.
- viewportLoaded · method · L133-L135 — Indicates whether viewport data has finished loading.
- getError · method · L137-L139 — Returns the current error message from layer state.
- updateState · method · L327-L363 — Invalidates tile cache when time range, zoom level, or temporal aggregation mode changes.
- renderLayers · method · L370-L413 — Creates and configures a TileLayer sublayer with vector rendering, velocity-based visibility, and feature highlighting.
- getLayerInstance · method · L415-L418 — Retrieves the underlying TileLayer instance from sublayers.
- getFourwingsLayers · method · L420-L422 — Returns the first sublayer for fourwings-specific operations.
- getAggregationOperation · method · L424-L426 — Returns the aggregation operation type for velocity calculations.
- getTilesData · method · L428-L444 — Extracts and flattens feature data from all selected, visible, and loaded tiles.
- getData · method · L446-L448 — Returns flattened feature data from all loaded tiles.
- getViewportData · method · L455-L469 — Filters and returns features within the current viewport bounds.
