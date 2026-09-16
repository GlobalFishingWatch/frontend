# libs/deck-layers/src/layers/fourwings/FourwingsLayer.ts · [[deck-gl-core-integration]] [[fourwings-unified-layer]]

TypeScript module defining the main FourwingsLayer composite class for visualizing four-wings data with multiple rendering modes and highlighting support.

- HighlightedTimeMillis · type · L31-L31 — Type alias representing optional start and end timestamps in milliseconds for highlighting time ranges.
- FourwingsLayerState · type · L33-L37 — Type defining internal state tracking for highlighted features and time range in the Fourwings layer.
- FourwingsColorRamp · type · L39-L42 — Type representing a color scale mapping numeric domains to color ranges for heatmap visualization.
- FourwingsLayerProps · type · L44-L55 — Type defining all configuration properties accepted by the FourwingsLayer, combining sub-layer props while excluding resolution and highlighted features.
- AnyFourwingsLayer · type · L57-L61 — Union type representing any of the possible sub-layer implementations that FourwingsLayer can render.
- FourwingsLayer · class · L68-L254 — Composite layer class that manages multiple visualization modes for four-wings fishing data including heatmaps, positions, and footprints.
- initializeState · method · L73-L78 — Initializes the layer's internal state with empty highlighted features on first render.
- cacheHash · method · L80-L82 — Generates a cache key from concatenated sub-layer cache hashes for efficient re-rendering.
- isHeatmapVisualizationMode · method · L84-L90 — Checks whether the current visualization mode is displaying heatmap or footprint data.
- debounceTime · method · L92-L94 — Retrieves the debounce delay from the active sub-layer or defaults to zero.
- _getHighlightedFeatures · method · L96-L98 — Returns the currently highlighted features from state, falling back to an empty array.
- _getHighlightTimes · method · L100-L105 — Retrieves the start and end timestamps for the current highlight time range.
- setHighlightedTime · method · L107-L115 — Updates the internal state with new highlight time range values.
- renderLayers · method · L117-L161 — Creates and returns the appropriate sub-layer instance based on the current visualization mode and configuration.
- setHighlightedVessel · method · L163-L168 — Delegates vessel highlighting to the positions layer if currently in positions visualization mode.
- setHighlightedFeatures · method · L170-L175 — Updates state with a new set of highlighted picking objects for map interaction.
- getData · method · L177-L179 — Delegates to the active sub-layer to retrieve processed data.
- getError · method · L181-L183 — Delegates to the active sub-layer to retrieve any loading or processing errors.
- getIsPositionsAvailable · method · L185-L194 — Determines whether position data is available based on visualization mode and layer load status.
- getInterval · method · L196-L201 — Retrieves the time interval from the heatmap layer if in heatmap mode and not using static rendering.
- getVisualizationMode · method · L203-L205 — Returns the current visualization mode or defaults to heatmap mode.
- getAggregationOperation · method · L207-L209 — Returns the aggregation operation configured for data summarization.
- getChunk · method · L211-L216 — Retrieves the current data chunk from the heatmap layer if applicable.
- getViewportData · method · L218-L220 — Delegates viewport data retrieval to the active sub-layer with optional parameters.
- getMode · method · L222-L224 — Returns the current visualization mode or defaults to heatmap mode.
- getResolution · method · L226-L228 — Computes the tile resolution based on the current visualization mode.
- getZoomOffset · method · L230-L237 — Calculates zoom level offset based on tile resolution and current viewport zoom.
- getLayer · method · L239-L241 — Returns the first active sub-layer cast to the appropriate type.
- getColorScale · method · L243-L245 — Delegates color scale retrieval to the active sub-layer.
- getColorByValue · method · L247-L249 — Maps a numeric value to its corresponding color using the heatmap layer's color scale.
- getFourwingsLayers · method · L251-L253 — Delegates retrieval of internal Fourwings layers from the active sub-layer.
