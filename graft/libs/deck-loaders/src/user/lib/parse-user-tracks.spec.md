# libs/deck-loaders/src/user/lib/parse-user-tracks.spec.ts · [[user-tracks-parsing-pipeline]]

Test suite validating the parseUserTrack function's ability to parse GeoJSON user tracks, generate level-of-detail binaries, and apply coordinate property filters.

- fullBinary · function · L6-L7 — Extracts the finest-resolution (full-tolerance) binary data from the last LOD level in a parsed track result.
- createLineStringFeature · function · L18-L38 — Factory function that constructs a GeoJSON LineString feature with optional coordinate and timing property overrides for test scenarios.
- createUserTrack · function · L40-L43 — Factory function that wraps an array of GeoJSON features into a FeatureCollection structure for testing track parsing.
- toArrayBuffer · function · L45-L48 — Converts a JSON string into an ArrayBuffer by encoding with TextEncoder and slicing to the exact byte range.
