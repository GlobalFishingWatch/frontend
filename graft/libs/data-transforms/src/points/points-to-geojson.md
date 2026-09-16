# libs/data-transforms/src/points/points-to-geojson.ts · [[coordinate-and-date-parsing-utilities]] [[points-to-geojson-transformation]] [[property-key-normalization]]

Module that provides utilities to convert raw point data into GeoJSON format with normalized properties and validated timestamps.

- cleanProperties · function · L11-L31 — Normalizes and validates GeoJSON properties by casting strings, removing invalid numeric values for coordinate/range types, and filtering by schema.
- pointsListToGeojson · function · L33-L77 — Transforms an array of raw point records into a GeoJSON FeatureCollection with validated coordinates, normalized properties, and converted timestamps.
- pointsGeojsonToNormalizedGeojson · function · L79-L96 — Converts UTC timestamp strings in GeoJSON feature properties to milliseconds for startTime and endTime fields.
