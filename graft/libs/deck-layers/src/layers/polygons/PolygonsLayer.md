# libs/deck-layers/src/layers/polygons/PolygonsLayer.ts · [[color-and-configuration-management]] [[debouncing-and-async-data-loading]] [[deck-gl-composite-layer-pattern]] [[deck-gl-layer-foundation]] [[interactive-picking-and-enrichment]] [[multi-mode-visualization]] [[polygon-rendering-layers]] [[polygons-layer]] [[shared-picking-and-layer-utilities]]

Module exporting a deck.gl composite layer for rendering and highlighting GeoJSON polygon features with interactive picking support.

- PolygonsLayerState · type · L38-L43 — State shape holding error status, highlighted features, debounced data URL, and pending debounce timer for the polygons layer.
- PolygonsLayer · class · L45-L246 — Composite layer that renders polygon geometries with outline and highlight layers, managing data loading debounce and feature highlighting.
- constructor · method · L52-L61 — Initializes the layer with data load and error handlers that update state on loading completion or failure.
- initializeState · method · L63-L69 — Sets up initial state by capturing the dataUrl string into debouncedDataUrl on layer initialization.
- updateState · method · L71-L99 — Debounces dataUrl changes over a configurable delay period to prevent excessive re-renders during rapid prop updates.
- finalizeState · method · L101-L107 — Cleans up any pending debounce timer when the layer is destroyed to prevent memory leaks.
- cacheHash · method · L109-L111 — Computes a cache key based on layer ID, error state, and loaded status to invalidate rendering when these change.
- getFillColor · method · L127-L135 — Determines fill color for a polygon feature: highlight fill if highlighted or picked, otherwise transparent.
- getHighlightLineWidth · method · L137-L145 — Returns line width for polygon outline: specified width if highlighted or picked, otherwise 0 for invisible outline.
- _getHighlightedFeatures · method · L147-L149 — Returns the current list of highlighted polygon features from state.
- renderLayers · method · L151-L238 — Generates four GeoJsonLayers for polygon outlines and highlight effects, controlling visibility and styling based on pick state.
- setHighlightedFeatures · method · L240-L245 — Updates the highlighted features in state to control visual styling of selected polygons.
