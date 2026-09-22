# libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.ts · [[deck-gl-composite-layer-pattern]] [[fourwings-positions-layer]] [[viewport-deduplication]]

Module containing a composite tile layer that renders vessel positions from the Fourwings API, with filtering, highlighting, and track visualization capabilities.

- FourwingsPositionsTileLayerState · type · L79-L92 — State interface tracking viewport status, positions, vessel tracks, highlights, and color scales for the tile layer.
- hasSameTileContents · function · L101-L103 — Utility function to detect whether a tile set contains identical content objects, avoiding redundant re-renders.
- FourwingsPositionsTileLayer · class · L105-L797 — Composite layer that loads and renders vessel positions from MVT tiles, with support for filtering, highlighting, and color-mapped display.
- cacheHash · method · L117-L122 — Generates a cache key from viewport dirty state to minimize unnecessary state updates.
- positions · method · L124-L131 — Filters positions by sublayer filterIds to return only matching position features.
- debounceTime · method · L133-L135 — Returns the debounce delay in milliseconds for viewport updates, defaulting to zero.
- viewportLoaded · method · L137-L139 — Indicates whether the current viewport has finished loading position data.
- dimOpacity · method · L141-L143 — Returns reduced opacity for non-highlighted vessels when any vessel is highlighted.
- timestampBase · method · L145-L147 — Computes the base timestamp in seconds for rebasing position timestamps relative to layer start time.
- highlightTimeRange · method · L150-L160 — Converts highlight time range from absolute milliseconds to rebased seconds for shader-driven time highlighting.
- getError · method · L162-L164 — Returns any error message from the last load or state update.
- initializeState · method · L172-L187 — Initializes layer state with empty positions, tracks, highlights, and load flags.
- updateViewportDirty · method · L195-L205 — Sets viewport dirty flag and debounces its reset to throttle expensive viewport-change operations.
- updateState · method · L207-L239 — Reacts to viewport changes, sublayer color ramp updates, and highlighted feature changes to maintain layer state.
- getLayerInstance · method · L263-L266 — Returns the underlying MVTLayer instance for direct access to deck.gl layer properties.
- _getColorRamp · method · L268-L291 — Computes color domain and range by sampling positions, filtering outliers within two standard deviations, and mapping to sublayer color ramps.
- _hasHighlightedVessels · method · L319-L321 — Determines if any vessel or feature is currently highlighted.
- _getIsHighlightedVessel · method · L330-L338 — Checks if a position belongs to a highlighted vessel and passes sublayer filter constraints.
- showVesselTracks · method · L410-L412 — Indicates whether vessel track paths should be rendered for the current category.
- _getPositionProperties · method · L519-L525 — Extracts supported position properties from each sublayer filter.
- _getDataUrl · method · L527-L567 — Constructs the tile data URL with query parameters for positions, time range, and sublayer filters.
- renderLayers · method · L569-L758 — Builds the layer tree with MVT base layer, icon layers, track paths, and label layers for positions and vessel tracks.
- getIconAngle · function · L581-L584 — Calculates the icon rotation angle from position bearing.
- getData · method · L764-L766 — Returns the current tile layer's data source.
- getColorDomain · method · L768-L770 — Exposes the color domain step values for external consumers.
- getColorRange · method · L772-L774 — Exposes the color range ramps for external consumers.
- getColorScale · method · L776-L783 — Provides access to the full computed color scale including domain and range.
- getFourwingsLayers · method · L785-L787 — Returns the parent Fourwings layer for context access.
- setHighlightedVessel · method · L789-L796 — Updates the highlighted vessel set with normalization to handle single or multiple vessel IDs.
