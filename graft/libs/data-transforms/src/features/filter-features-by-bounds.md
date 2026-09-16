# libs/data-transforms/src/features/filter-features-by-bounds.ts · [[antimeridian-geometry-handling]] [[geospatial-data-transformations]]

Module that filters geographic features by viewport bounds, handling world wrapping edge cases and optionally extracting temporal values.

- Bounds · interface · L10-L15 — Defines cardinal boundaries for a geographic rectangular region.
- GeoJSONFeature · class · L21-L37 — Type declaration for a GeoJSON feature as provided by the MapLibre GL vector tile system.
- filterFeaturesByBounds · function · L39-L97 — Filters geographic features by latitude/longitude bounds, accounting for world-wrapping edge cases and optionally returning sublayer values with start frames.
