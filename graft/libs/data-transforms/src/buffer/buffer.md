# libs/data-transforms/src/buffer/buffer.ts · [[antimeridian-geometry-handling]] [[geospatial-data-transformations]]

Module providing utility functions to buffer GeoJSON features with support for antimeridian wrapping.

- BufferedFeature · type · L6-L6 — Type alias for a GeoJSON feature with Polygon or MultiPolygon geometry.
- BufferUnit · type · L8-L8 — Union type defining supported distance units for buffering operations.
- BufferOperation · type · L9-L9 — Union type defining supported buffer operations on geometries.
- GetGeometryBufferParams · type · L10-L13 — Configuration object type specifying the distance value and unit for a buffer operation.
- getFeatureBuffer · function · L15-L45 — Buffers one or more features by a specified distance and wraps geometries that cross the antimeridian.
