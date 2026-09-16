# libs/data-transforms/src/union/union.ts · [[polygon-boolean-operations]]

- PolygonCoords · type · L4-L4 — Type alias for the coordinate structure of a GeoJSON Polygon geometry.
- MultiPolygonCoords · type · L5-L5 — Type alias for the coordinate structure of a GeoJSON MultiPolygon geometry.
- PolygonGeomCoords · type · L6-L6 — Union type representing coordinates from either a single Polygon or a MultiPolygon.
- toPolygonFeature · function · L9-L12 — Converts coordinates to a GeoJSON Feature by distinguishing Polygon from MultiPolygon based on coordinate depth.
- toMultiPolygonCoords · function · L14-L19 — Normalizes a Polygon or MultiPolygon geometry to MultiPolygon coordinate format for uniform processing.
- getPolygonsUnion · function · L21-L27 — Computes the union of multiple polygons, handling single-polygon edge case before delegating to Turf.
- getPolygonsIntersection · function · L29-L35 — Computes the intersection of two polygons using Turf's intersect operation.
