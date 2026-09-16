# libs/deck-layers/src/layers/context/context.types.ts · [[context-layer-system]] [[deck-gl-core-integration]]

- ContextSublayerCallbackParams · type · L9-L12 — Generic type for callback parameters that passes layer configuration and sublayer context to callback handlers.
- ContextLayerId · enum · L14-L27 — Enumeration of all supported context layer types including EEZ, MPAs, FAO zones, and other geographic boundaries.
- ContextLayerConfigFilter · type · L29-L29 — Type alias for flexible filter objects applied to context layer data.
- ContextSubLayerConfig · type · L30-L40 — Configuration schema for individual sublayers within a context layer, including styling, filtering, and data aggregation properties.
- ContextLayerConfig · type · L41-L50 — Configuration schema for a complete context layer, specifying dataset source, tile URL, and array of sublayer configurations.
- ContextLayerProps · type · L52-L56 — Props type for context layer components, composing DeckLayerProps with context-specific configuration array.
- ContextFeatureBaseProperties · type · L58-L66 — Base properties required for all context features, including identification, styling, and value metadata.
- ContextFeatureProperties · type · L68-L70 — Extended feature properties that add optional link information to base context feature properties.
- ContextFeature · type · L72-L75 — GeoJSON Feature type constrained to polygon and linestring geometries for context geographic data.
- ContextPickingObject · type · L77-L77 — Type for objects returned when user picks a context feature, combining feature and property data.
- ContextPickingInfo · type · L79-L79 — Type for picking information events from deck.gl, including context features and tile metadata.
