# libs/deck-layers/src/layers/draw/DrawLayer.ts · [[deck-gl-editable-layers-integration]] [[drawing-and-editing-layer]] [[geometry-validation-and-error-handling]] [[immutable-feature-state-management]]

DrawLayer class that manages drawing and editing vector features (points and polygons) on a deck.gl map, tracking state for selected features, editing modes, and feature geometry validation.

- Color · type · L32-L32 — Type alias for RGBA color representation as a 4-element array of numbers.
- getFeaturesWithOverlapping · function · L61-L70 — Enriches feature collection with a property indicating whether each geometry has self-intersecting segments detected by the kinks algorithm.
- getDrawDataParsed · function · L72-L77 — Parses draw data by adding overlapping feature detection metadata to each feature in the collection.
- DrawLayerState · type · L83-L90 — Type definition for the internal state of the DrawLayer, tracking features, selection, editing mode, and geometry validity.
- DrawFeatureType · type · L92-L92 — Union type that constrains drawable feature types to either polygons or points.
- DrawLayerProps · type · L93-L96 — Configuration props for DrawLayer specifying the feature type to draw and an optional callback when layer state changes.
- DrawLayer · class · L98-L439 — Composite layer that manages interactive drawing and editing of GeoJSON features with mode switching, selection tracking, and geometry validation.
- initializeState · method · L115-L124 — Sets up the initial layer state with an empty feature collection, drawing mode, and no selections.
- _setState · method · L140-L145 — Updates layer state and triggers the onStateChange callback to notify listeners of state mutations.
- getPickingInfo · method · L285-L298 — Transforms deck.gl picking info into DrawLayer-specific picking info by adding layer ID, category, and feature metadata.
- renderLayers · method · L404-L438 — Creates and returns an EditableGeoJsonLayer configured with styles and callbacks appropriate for the current feature type and state.
