# libs/deck-layers/src/layers/user/user.utils.ts · [[data-transformation-pipeline]] [[temporal-filtering-architecture]] [[user-layer-system]]

Utility module providing time-range filtering and feature validation functions for user-defined deck layers.

- IsFeatureInRangeParams · type · L11-L17 — Type definition specifying the required parameters for time-range filtering of geospatial features.
- getFeatureTimeRange · function · L19-L47 — Extracts and normalizes start and end timestamps from a feature's properties, with special handling based on the time filter type.
- isFeatureInRange · function · L49-L66 — Determines whether a feature's time range overlaps with a specified time window.
- getFilterExtensionSize · function · L68-L75 — Calculates the size of a filter extension based on whether it contains nested filter ranges.
