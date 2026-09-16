# libs/deck-layers/src/layers/user/UserTracksLayer.ts · [[data-transformation-pipeline]] [[debouncing-and-async-data-loading]] [[deck-gl-layer-foundation]] [[global-fishing-watch-api-integration]] [[response-caching-with-expiration]] [[shader-based-filtering-and-highlighting]] [[user-layer-system]]

TypeScript module that exports deck.gl composite and path layers for rendering user track data with time-based filtering and highlighting.

- _UserTrackLayerProps · type · L53-L53 — Type alias combining UserTrackLayerProps and PathLayerProps to define all configuration properties for the track path layer.
- UserTracksPathLayer · class · L90-L181 — Custom deck.gl PathLayer subclass that renders track paths with GLSL shader injection for time-based filtering, highlighting, and adaptive pick-width.
- getShaders · method · L97-L136 — Customizes deck.gl shader modules to add time-window filtering, highlight color injection, and dynamic pick-width scaling in vertex and fragment shaders.
- initializeState · method · L138-L152 — Registers an instanced attribute for per-vertex timestamps to enable time-based filtering and highlighting logic in shaders.
- draw · method · L154-L180 — Passes runtime time filters and pick-width ratio to shader uniforms before rendering the path layer.
- UserTrackContextLayer · type · L183-L183 — Type alias for a single layer element from the UserTrackLayerProps layers array.
- UserTrackSublayer · type · L184-L184 — Type alias for a single sublayer element from a UserTrackContextLayer.
- RawDataIndex · type · L186-L186 — Record type that maps path indices to their corresponding feature indices for efficient picking.
- UserTracksLayerState · type · L187-L202 — State object that caches parsed track data, multiple LOD levels, feature-to-path index mappings, and highlight selections.
- UserTracksLayer · class · L209-L601 — CompositeLayer that loads, parses, and renders user track GeoJSON data with LOD switching, time filtering, and interactive highlighting.
- shouldUpdateState · method · L220-L222 — Overrides shouldUpdateState to trigger layer re-render when viewport zoom crosses LOD index boundaries.
- updateState · method · L224-L244 — Clears cached data when filters or tile URLs change, and updates LOD index when viewport zoom changes.
- _getLayerKey · method · L246-L255 — Generates a cache key from layer ID, sublayer ID, tile URL, and filter operators to identify unique data configurations.
- _getDataKey · method · L257-L261 — Retrieves the cache key for the first layer's first sublayer to determine if cached data is still valid.
- _getLodIndex · method · L263-L268 — Determines which LOD (level of detail) version to render based on current viewport zoom level.
- _getHighlightedFeatures · method · L270-L272 — Returns the list of currently highlighted features, or an empty array if none are selected.
- setHighlightedFeatures · method · L274-L279 — Updates the layer state with a new set of features to visually highlight.
- _getHighlightTimes · method · L281-L286 — Returns the current highlight time window, preferring state values over props.
- setHighlightedTime · method · L288-L296 — Updates the layer state with a new time range for highlighting track segments.
- _getFeatureIndex · method · L444-L453 — Looks up the feature index for a given path index using the pre-computed pathFeatureIndexes mapping.
- getError · method · L461-L463 — Returns any error message from the data parsing or loading process.
- getData · method · L465-L467 — Returns the parsed raw GeoJSON track data.
- getColor · method · L469-L472 — Retrieves the color assigned to the first sublayer.
- getSegments · method · L474-L485 — Converts the track GeoJSON data into simplified or full track segments for distance and duration analysis.
- getBbox · method · L487-L534 — Calculates bounding box of all track coordinates, filtering by optional date range and handling antimeridian crossing.
- addLine · function · L501-L518 — Updates min/max lon/lat bounds by iterating coordinates and filtering by timestamp range.
- renderLayers · method · L556-L600 — Composes and returns the sub-layers that render the current LOD version of track data with highlighting.
