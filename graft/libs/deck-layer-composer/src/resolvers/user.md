# libs/deck-layer-composer/src/resolvers/user.ts · [[dataset-client]] [[type-specific-layer-resolvers]] [[user-data-and-polygon-layers]] [[user-draw-layer-identification]] [[user-layer-resolution]]

Exports resolver functions and utilities to transform dataset configurations into DeckGL layer properties for user-created geographic and contextual layers.

- getUserContextTimeFilterProps · function · L24-L59 — Extracts time-based filter properties from a dataset to enable temporal filtering on user layer visualizations.
- getUserPolygonColorProps · function · L61-L82 — Retrieves polygon color styling configuration and computes color range steps based on dataset filter enumerations.
- getUserCircleProps · function · L84-L130 — Computes point size and radius styling properties for user-context point layers from dataset configuration and filter ranges.
- resolveDeckUserLayerProps · function · L132-L226 — Resolves complete DeckGL layer properties for user layers by combining base configuration, tiles URLs, bounds, sublayer filters, and time filters.
- resolveDeckUserContextLayerProps · function · L228-L238 — Resolves DeckGL polygon layer properties by merging base user layer props with polygon-specific color styling.
- resolveDeckUserPointsLayerProps · function · L240-L251 — Resolves DeckGL points layer properties by merging base user layer props with circle sizing and styling configuration.
- resolveDeckUserTracksLayerProps · function · L253-L264 — Resolves DeckGL tracks layer properties by merging base user layer props with single-track display configuration.
