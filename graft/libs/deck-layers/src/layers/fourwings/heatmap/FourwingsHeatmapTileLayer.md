# libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapTileLayer.ts · [[comparison-mode-rendering]] [[dynamic-color-ramping]] [[fourwings-heatmap-layer]] [[temporal-aggregation-caching]]

Composite tile layer for rendering Fourwings heatmap data with support for color domain scaling, time comparison, and bivariate visualization modes.

- FourwingsHeatmapTileLayer · class · L88-L785 — CompositeLayer that renders Fourwings heatmap data across multiple zoom levels with cached tiles, dynamic color scales, and support for bivariate, time-compare, and standard comparison modes.
- initializeState · method · L94-L114 — Initializes the layer state with an empty error, tile cache based on zoom and time range, empty color domain, and color ranges for the current sublayers.
- finalizeState · method · L116-L119 — Cleans up pending tile cache update timeouts when the layer is destroyed.
- _clearPendingTilesCacheUpdate · method · L121-L127 — Cancels any pending tile cache update timeout and resets the state reference to null.
- cacheHash · method · L129-L135 — Generates a unique cache hash combining tile data cache key, comparison mode, color ramps, ramp dirty flag, viewport loaded state, and visible sublayer values.
- debounceTime · method · L137-L139 — Getter that returns the debounce time in milliseconds, defaulting to 0 if not specified.
- viewportLoaded · method · L141-L143 — Getter that indicates whether the viewport has finished loading visible tiles.
- getError · method · L145-L147 — Returns any error message that occurred during tile loading or processing.
- updateState · method · L544-L627 — Responds to prop changes by updating tile cache when time range or comparison parameters change, recalculating color domain when sublayer visibility or colors shift.
- renderLayers · method · L629-L667 — Renders child heatmap layers for each visible sublayer or comparison mode configuration with the current color scales and viewport data.
- getLayerInstance · method · L669-L672 — Retrieves the underlying TileLayer instance used by this composite layer.
- getTilesData · method · L674-L690 — Provides a list of all currently loaded tiles from the underlying TileLayer.
- getData · method · L692-L694 — Returns the features data from all loaded tiles in the current viewport.
- getIsPositionsAvailable · method · L696-L711 — Checks whether geolocation position data is available for all loaded tiles in a given zoom range.
- getViewportData · method · L713-L727 — Retrieves and filters tile data for the current viewport, optionally transforming features based on aggregation operation and time range.
- getFourwingsLayers · method · L729-L735 — Builds the list of child FourwingsHeatmapLayer instances to render based on the current comparison mode and sublayer visibility.
