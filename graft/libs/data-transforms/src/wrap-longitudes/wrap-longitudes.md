# libs/data-transforms/src/wrap-longitudes/wrap-longitudes.ts · [[antimeridian-handling]]

Module exports functions to handle antimeridian wrapping and unwrapping of geographic coordinates and bounding boxes.

- wrapLongitudes · function · L12-L28 — Adjusts longitude values by 360° increments to prevent antimeridian crossing artifacts in sequential coordinates.
- wrapBBoxLongitudes · function · L30-L34 — Applies longitude wrapping to a bounding box's min and max longitude values.
- wrapPointLongitudes · function · L36-L59 — Wraps longitude values in Point features to ensure continuous rendering across the antimeridian.
- wrapLineStringLongitudes · function · L61-L87 — Wraps longitude values in all coordinates of LineString features to handle antimeridian crossing.
- WrapLongitudesParams · type · L89-L91 — Configuration type that controls whether longitudes should be normalized near the antimeridian.
- wrapLineStringFeatureCoordinates · function · L93-L108 — Wraps longitude coordinates of a single LineString feature by tracking cumulative 360° offsets.
- normalizeLongitude · function · L110-L114 — Clamps longitudes near the antimeridian to BUFFERED_ANTIMERIDIAN_NORMALIZED to avoid edge cases in geometric operations.
- wrapPolygonFeatureCoordinates · function · L116-L127 — Normalizes and shifts negative longitudes to 0–360° range for Polygon coordinates, optionally normalizing antimeridian values.
- wrapMultipolygonFeatureCoordinates · function · L129-L136 — Applies Polygon wrapping logic to each ring in a MultiPolygon's coordinate structure.
- wrapFeatureLongitudes · function · L138-L160 — Dispatches to appropriate wrapping function based on feature geometry type (LineString, Polygon, or MultiPolygon).
- getTurfBbox · function · L168-L170 — Computes a bounding box safe to store as a geometry member that turf.js can validate.
- wrapGeometryBbox · function · L172-L189 — Expands a bounding box past ±180 to represent antimeridian-crossing geometries as a continuous range for map viewport fitting.
- wrapFeaturesLongitudes · function · L191-L193 — Maps the wrapFeatureLongitudes function over a list of LineString or Polygon features.
- unwrapPositions · function · L198-L202 — Shifts a position array by world multiples so its mean longitude lands within the standard [-180, 180] range.
- unwrapCoordinates · function · L204-L219 — Recursively unwraps nested coordinate arrays to bring all longitudes back into the [-180, 180] range.
- unwrapFeatureLongitudes · function · L229-L240 — Inverse of wrapFeatureLongitudes: brings all coordinates back into [-180, 180] to prevent silent mismatches in antimeridian-split geometries.
- worldClipRing · function · L243-L251 — Generates a rectangular clipping boundary representing one world copy from west longitude.
- clipWorldCopy · function · L257-L265 — Intersects coordinates with a world copy boundary and shifts the result back into the standard [-180, 180] range.
- splitGeometryAtAntimeridian · function · L271-L292 — Clips geometries that span past ±180 back into GeoJSON's [-180, 180] range by splitting into separate world copies.
