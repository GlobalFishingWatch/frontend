# libs/data-transforms/src/wrap-longitudes/get-turf-bbox.test.ts · [[antimeridian-handling]]

Test suite for getTurfBbox and wrapGeometryBbox functions that handle bbox calculations across the antimeridian.

- antimeridianArea · function · L7-L29 — Factory function that creates a MultiPolygon geometry representing an area split at the antimeridian (±180° longitude).
