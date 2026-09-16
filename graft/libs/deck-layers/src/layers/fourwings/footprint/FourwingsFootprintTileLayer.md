# libs/deck-layers/src/layers/fourwings/footprint/FourwingsFootprintTileLayer.ts · [[fourwings-footprint-layer]] [[vector-tile-layer-infrastructure]]

Composite deck.gl layer that renders Fourwings fisheries heatmap data as tiled footprints with viewport-aware data fetching and caching.

- FourwingsFootprintTileLayer · class · L54-L307 — Composite layer class that manages Fourwings heatmap footprint tiles with caching, state synchronization, and viewport-aware data loading.
- initializeState · method · L60-L71 — Initializes layer state with tile cache, error tracking, and viewport load status.
- cacheHash · method · L73-L75 — Computes a cache key hash representing the current tile data cache configuration.
- debounceTime · method · L77-L79 — Returns the debounce time in milliseconds for delaying tile requests.
- viewportLoaded · method · L81-L83 — Indicates whether all tiles for the current viewport have been loaded.
- getError · method · L85-L87 — Returns the current error message from tile loading or processing.
- updateState · method · L171-L189 — Recalculates tile cache when time range or available intervals change, detecting when cached data bounds are exceeded.
- renderLayers · method · L191-L220 — Creates a TileLayer with Fourwings footprint sublayers configured for tile rendering and caching.
- getLayerInstance · method · L222-L225 — Retrieves the primary TileLayer instance from the composite layer's sublayers.
- getTilesData · method · L227-L243 — Extracts and aggregates feature data from selected, visible, and loaded tiles, filtering by tile state.
- getData · method · L245-L247 — Flattens tile data into a single array of Fourwings features.
- getIsPositionsAvailable · method · L249-L264 — Checks whether the loaded tile data contains sufficient position features within the viewport and time range.
- getViewportData · method · L266-L280 — Filters loaded features to those within the current viewport bounds using geographic coordinates.
- getFourwingsLayers · method · L282-L284 — Returns the list of configured sublayers for the heatmap visualization.
