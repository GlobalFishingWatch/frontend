# libs/deck-layers/src/layers/_shared/tiles.utils.ts · [[tile-coordinate-system]]

- Point · function · L13-L18 — Unprojjects a single point from tile-relative normalized coordinates to world coordinates using viewport projection.
- getPoints · function · L20-L22 — Maps an array of points through the Point transformation to convert tile coordinates to world coordinates.
- MultiPoint · function · L24-L26 — Transforms a multipoint geometry by unprojecting all constituent points to world coordinates.
- LineString · function · L28-L30 — Transforms a linestring geometry by unprojecting all coordinate points along the line.
- MultiLineString · function · L32-L34 — Transforms a multilinestring geometry by unprojecting each constituent linestring.
- Polygon · function · L36-L38 — Transforms a polygon geometry by unprojecting all coordinate points in each ring.
- MultiPolygon · function · L40-L42 — Transforms a multipolygon geometry by unprojecting each constituent polygon.
- getMVTSublayerProps · function · L53-L78 — Computes the model matrix, coordinate origin, and clipping extension configuration for an MVT tile sublayer based on its zoom level and position.
- isPMTilesUrl · function · L80-L82 — Checks whether a given URL points to a PMTiles file by looking for the .pmtile extension.
- getPMTilesSublayerProps · function · L84-L99 — Extracts the geographic bounding box from a PMTiles tile and wraps it as clip bounds for the sublayer.
- transformCoordinates · function · L102-L115 — Reprojects geometry coordinates from tile space to world space using the appropriate type-specific transformation and viewport projection.
- transformTileCoordsToWGS84 · function · L117-L131 — Converts a GeoJSON feature's geometry coordinates from tile space to world space while preserving the feature structure.
