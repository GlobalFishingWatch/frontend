# libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.ts · [[dynamic-color-ramping]] [[fourwings-heatmap-layer]]

Static heatmap layer for fourwings that aggregates temporal data across a fixed time window without per-frame variation.

- FourwingsHeatmapStaticLayer · class · L71-L319 — Composite layer class that renders temporally-aggregated Fourwings heatmap tiles with dynamic color domain calculation and viewport-aware data loading.
- initializeState · method · L76-L87 — Initializes layer state with empty error, color domain, and scales for static heatmap rendering.
- cacheHash · method · L89-L95 — Generates a cache invalidation key based on sublayer color ramps, ramp dirty state, and visible values.
- debounceTime · method · L97-L99 — Returns the debounce delay in milliseconds for throttling color domain updates.
- viewportLoaded · method · L101-L103 — Getter that indicates whether the current viewport's tiles have been loaded.
- _getState · method · L105-L107 — Retrieves the internal layer state object.
- getError · method · L122-L124 — Returns any error message from the most recent tile loading attempt.
- updateState · method · L206-L215 — Detects color ramp changes and recalculates the color domain to reflect updated sublayer styling.
- renderLayers · method · L217-L257 — Constructs and configures a TileLayer with static temporal aggregation, color scales, and Fourwings heatmap sub-layer rendering.
- getLayerInstance · method · L259-L262 — Retrieves the underlying TileLayer instance used to render the heatmap tiles.
- getTilesData · method · L264-L279 — Aggregates feature data from all selected, visible, and loaded tiles in the viewport.
- getData · method · L281-L283 — Delegates to getTilesData to return all currently loaded Fourwings features.
- getViewportData · method · L285-L299 — Filters loaded features by current viewport geographic bounds to support spatial queries.
- getFourwingsLayers · method · L301-L303 — Returns the sublayer configuration objects that define datasets, filters, and color ramps.
