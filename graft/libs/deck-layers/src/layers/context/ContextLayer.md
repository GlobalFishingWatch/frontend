# libs/deck-layers/src/layers/context/ContextLayer.ts · [[context-layer-system]] [[vector-tile-layer-infrastructure]]

A composite tile layer that renders geographic context features with highlighting, filtering, and interactive picking support.

- _ContextLayerProps · type · L51-L51 — Type alias combining tile layer and context-specific properties.
- ContextLayerState · type · L53-L55 — State type that tracks currently highlighted features for the context layer.
- ContextLayer · class · L63-L407 — Composite layer class that renders context features with highlighting, filtering, and interactive picking.
- initializeState · method · L71-L76 — Initializes the layer state with an empty highlighted features array.
- filtersHash · method · L78-L86 — Computes a hash of all active filter values across all sublayers for change detection.
- cacheHash · method · L88-L90 — Generates a unique hash combining layer ID, filter state, and load status for caching.
- _getHighlightedFeatures · method · L92-L94 — Returns the current set of highlighted features or an empty array as default.
- getHighlightLineWidth · method · L96-L114 — Computes line width for highlight strokes, returning thicker width if feature is highlighted.
- getFillColor · method · L116-L126 — Returns highlight fill color if feature is picked, otherwise returns transparent.
- getDashArray · method · L128-L130 — Returns dash pattern for line rendering, solid for settled EEZ boundaries or dashed otherwise.
- getRenderedFeatures · method · L176-L212 — Extracts and transforms currently visible context features from tile layers with optional max limit.
- renderLayers · method · L214-L399 — Creates sublayers for features including boundary, fill, and highlight line layers with appropriate styling and filtering.
- setHighlightedFeatures · method · L401-L406 — Updates the layer state with a new set of highlighted features to trigger visual updates.
