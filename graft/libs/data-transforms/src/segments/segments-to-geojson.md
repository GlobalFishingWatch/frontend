# libs/data-transforms/src/segments/segments-to-geojson.ts · [[segments-to-geojson-conversion]]

Module providing transformation utilities between track segment data and GeoJSON FeatureCollection formats.

- segmentsToFeatures · function · L10-L59 — Converts one or more track segments into GeoJSON LineString features with coordinate-level properties like timestamps, speeds, and elevations.
- segmentsToGeoJSON · function · L61-L77 — Wraps converted track segments into a GeoJSON FeatureCollection with optional metadata.
- geoJSONToSegments · function · L81-L142 — Reconstructs track segments from GeoJSON features, handling both LineString and MultiLineString geometries and optionally extracting only segment endpoints.
- getSegmentExtents · function · L144-L146 — Extracts the start and end points of each track segment.
