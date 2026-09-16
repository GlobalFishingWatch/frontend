# libs/data-transforms/src/files/kml-to-geojson.ts · [[defensive-parsing-and-error-normalization]] [[file-format-conversion-pipeline]]

Module that converts KML and KMZ files to GeoJSON format with coordinate timestamp parsing and geometry type validation.

- invalidDataErrorHandler · function · L13-L24 — Throws a geometry-type-specific error when KML data does not contain the expected geometry features.
- hasAnyTag · function · L26-L27 — Checks whether a KML document contains any of the specified XML tag names.
- toMillis · function · L29-L33 — Converts a time string or number to UTC milliseconds, returning null for invalid or missing values.
- parseCoordinateTimes · function · L35-L49 — Transforms coordinate timestamp properties from strings to UTC milliseconds for GeoJSON features.
- kmlToGeoJSON · function · L51-L102 — Parses KML or KMZ files into GeoJSON features, validating that the requested geometry type exists and converting timestamps to milliseconds.
