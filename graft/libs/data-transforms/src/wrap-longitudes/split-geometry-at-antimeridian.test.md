# libs/data-transforms/src/wrap-longitudes/split-geometry-at-antimeridian.test.ts · [[antimeridian-handling]]

Test suite for the splitGeometryAtAntimeridian function, verifying correct handling of geometries that cross the antimeridian boundary.

- lons · function · L9-L10 — Extracts all longitude coordinates from a Polygon or MultiPolygon geometry.
- antimeridianArea · function · L13-L35 — Factory function that creates a test MultiPolygon representing a geospatial area split by the antimeridian at ±180 degrees.
