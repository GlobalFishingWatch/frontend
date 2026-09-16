# libs/deck-layers/src/layers/user/UserBaseLayer.ts · [[deck-gl-layer-foundation]] [[global-fishing-watch-api-integration]] [[interactive-picking-and-enrichment]] [[multi-mode-visualization]] [[shared-picking-and-layer-utilities]] [[temporal-filtering-architecture]] [[user-layer-system]]

Composite layer for rendering user-generated map data with filtering and tile-based rendering capabilities.

- _UserBaseLayerProps · type · L43-L44 — Union type representing all possible layer property combinations for user-generated layers.
- BoundsResponse · type · L57-L61 — Response object containing geographic bounding box and optional time range metadata from a bounds API call.
- UserBaseLayerState · type · L63-L65 — Layer state container tracking currently highlighted features for visual emphasis.
- UserBaseLayerProps · type · L67-L67 — Typed props interface for the UserBaseLayer extending base layer props with deck-gl framework context.
- UserBaseLayer · class · L70-L456 — Abstract composite layer class providing core rendering, filtering, and interaction logic for user-generated geographic data visualization.
- initializeState · method · L77-L82 — Initializes layer state with an empty highlighted features list on layer creation.
- getBbox · method · L84-L137 — Fetches geographic bounding box and time range metadata for a sublayer, applying date and dateRange filters to a bounds API endpoint.
- _getHighlightedFeatures · method · L139-L141 — Returns the currently highlighted features list from layer state.
- setHighlightedFeatures · method · L143-L148 — Updates the layer state with a new set of highlighted features for interactive visual feedback.
- getRenderedFeatures · method · L204-L245 — Collects and filters currently visible features from all tile layers, respecting sublayer and picking constraints up to a maximum count.
- _getTilesUrl · method · L247-L275 — Builds a tile server URL with query parameters for properties, filters, and time fields to invalidate cache on layer configuration changes.
- _getTimeFilterProps · method · L277-L327 — Constructs DataFilterExtension configuration for date or dateRange time filtering based on layer properties.
- _getSublayerFilterExtensionProps · method · L329-L340 — Generates DataFilterExtension configuration for sublayer attribute filtering when filter operators are supported.
- _combineFilterExtensionProps · method · L342-L418 — Merges time and sublayer filter extensions into a single configuration, combining filter values and ranges within deck.gl's 4-channel limit.
- _getExtensionFilterProps · method · L420-L455 — Assembles final filter and clip extensions with update triggers for efficient GPU-side feature filtering and layer clipping.
