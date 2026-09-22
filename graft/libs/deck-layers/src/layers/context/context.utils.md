# libs/deck-layers/src/layers/context/context.utils.ts · [[context-layer-system]] [[tile-data-access-patterns]]

Utility functions for context layer features, filtering, and URL generation in a geographic visualization system.

- getContextId · function · L21-L32 — Extracts a unique identifier for a context feature, falling back through multiple property sources to handle aggregated features.
- getContextFiltersHash · function · L34-L38 — Generates a hash string from filter values to detect filter configuration changes.
- getContextFilterOperatorsHash · function · L40-L46 — Generates a hash string from filter operator key-value pairs to detect operator configuration changes.
- getValidSublayerFilters · function · L48-L56 — Filters out undefined or empty filter entries to produce a clean filter object for a sublayer.
- hasSublayerFilters · function · L58-L60 — Checks whether a sublayer has any valid filters configured.
- supportDataFilterExtension · function · L67-L76 — Validates that combined filter extension sizes stay within GPU limits by summing time and sublayer filter dimensions.
- getContextLink · function · L106-L140 — Maps a picked context feature to an external URL based on its layer type and properties.
- getSelectedTilesFeatures · function · L149-L176 — Extracts and transforms features from all currently selected tiles in the viewport, converting to WGS84 coordinates when needed.
- mergePickedFeatures · function · L178-L228 — Deduplicates picked features by ID and layer, merging polygon geometries into a single MultiPolygon when multiple features share the same identity.
