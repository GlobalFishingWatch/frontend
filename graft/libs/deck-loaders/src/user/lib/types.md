# libs/deck-loaders/src/user/lib/types.ts · [[lod-pyramid-and-zoom-aware-rendering]] [[user-tracks-parsing-pipeline]]

Type definitions for user track data structures used in deck.gl-based path rendering with levels-of-detail support.

- UserTrackBinaryData · type · L3-L15 — Binary representation of track geometry with flat coordinate arrays and per-path indexing for efficient rendering.
- UserTrackFeatureProperties · type · L17-L20 — Properties schema for track features including optional identifier and coordinate-level metadata.
- UserTrackFeature · type · L21-L21 — GeoJSON Feature wrapping line or multiline geometries with track-specific properties.
- UserTrackRawData · type · L22-L25 — GeoJSON FeatureCollection containing track features with their geometries and properties.
- UserTrackLod · type · L27-L31 — Level-of-detail definition associating zoom threshold and simplification tolerance with binary track data.
- UserTrackData · type · L33-L38 — Complete track dataset combining raw feature data with multiple resolution levels for adaptive zoom-based rendering.
