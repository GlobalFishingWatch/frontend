# apps/platform/features/_map/map/overlays/draw/draw.utils.ts · [[drawing-coordinate-system]] [[drawn-feature-geojson-serialization]]

Utility module providing helper functions to construct dataset definitions and export drawn GeoJSON features with auto-incremented identifiers.

- getDrawDatasetDefinition · function · L16-L37 — Constructs a dataset definition for user-drawn map features with the appropriate metadata, geometry type, and GeoJSON configuration.
- getFileWithFeatures · function · L39-L63 — Packages GeoJSON features into a downloadable file, assigning sequential identifiers to features that lack them based on the maximum existing ID.
