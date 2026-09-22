# libs/deck-loaders/src/user/lib/simplify-user-tracks.ts · [[lod-pyramid-and-zoom-aware-rendering]] [[simplify-js-dependency]] [[timestamp-alignment-across-simplification]] [[user-tracks-simplification-and-lod-selection]]

Provides Douglas-Peucker simplification of user track geospatial data with zoom-dependent levels-of-detail.

- mercatorY · function · L5-L7 — Converts latitude to Web Mercator y-coordinate for consistent coordinate transformation.
- toleranceAtZoom · function · L10-L10 — Calculates the Douglas-Peucker tolerance in degrees that corresponds to 0.5 pixels of error at a given zoom level.
- IndexedPoint · type · L20-L20 — Type representing a 2D point with an original index for tracking positions through simplification.
- simplifyUserTrackBinary · function · L25-L73 — Applies Douglas-Peucker simplification to track paths while preserving alignment between position and timestamp arrays.
- buildUserTrackLods · function · L75-L81 — Generates a progressive level-of-detail pyramid by simplifying a user track at multiple tolerance thresholds for efficient multi-zoom rendering.
- getUserTrackLodIndex · function · L83-L89 — Selects the appropriate pre-simplified track representation for the current zoom level by finding the highest minZoom threshold that does not exceed it.
