# libs/data-transforms/src/files/shp-to-geojson.ts · [[defensive-parsing-and-error-normalization]] [[file-format-conversion-pipeline]]

Module that converts shapefile data to GeoJSON format with geometry type validation.

- invalidDataErrorHandler · function · L6-L17 — Throws geometry-type-specific error messages when shapefile data does not match the expected dataset geometry type.
- shpToGeoJSON · function · L19-L48 — Parses shapefile binary data into GeoJSON, validates that all features match the requested geometry type, and rejects multi-file shapefiles.
