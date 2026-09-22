# libs/data-transforms/src/dissolve/dissolve.ts · [[antimeridian-geometry-handling]] [[geospatial-data-transformations]]

Module that exports geometry dissolution functionality for converting point, polygon, and multipolygon geometries into dissolved feature collections.

- getGeometryDissolved · function · L6-L41 — Dissolves point, polygon, or multipolygon geometries into a single feature collection, wrapping features that cross the antimeridian and merging overlapping polygons.
