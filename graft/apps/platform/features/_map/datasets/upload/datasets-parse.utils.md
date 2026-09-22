# apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts · [[asynchronous-file-type-detection]] [[dataset-upload-and-parsing]] [[dual-path-geojson-transformation-for-points]] [[geospatial-data-transform-contracts]]

- DataList · type · L41-L41 — Type alias for an array of generic record objects representing tabular data rows.
- GriddedData · type · L42-L42 — Type alias for raster data structures that represent either GeoTIFF band count or NetCDF variable names.
- DatasetParsedByType · type · L43-L48 — Discriminated union type mapping dataset geometry types to their parsed data representation (gridded, vectors, or tabular lists).
- DataParsed · type · L49-L49 — Type alias constraining parsed dataset output to a geometry type supported by the system.
- validateFeatures · function · L59-L119 — Validates and normalizes GeoJSON features to match expected geometry types, converting closed linestrings to polygons and filtering invalid geometries.
- validatedGeoJSON · function · L121-L124 — Parses a JSON string into GeoJSON and validates its features match the dataset geometry type.
- getDatasetParsed · function · L126-L189 — Main entry point that detects file type and parses any supported geospatial dataset format into normalized GeoJSON or gridded data structure.
- getTrackFromList · function · L191-L206 — Transforms tabular point records into a track GeoJSON by extracting coordinates and temporal metadata from dataset configuration.
- getGeojsonFromPointsList · function · L208-L225 — Converts tabular point records into a GeoJSON feature collection using dataset configuration to locate lat/lon and optional temporal fields.
- getNormalizedGeojsonFromPointsGeojson · function · L227-L235 — Normalizes a points GeoJSON feature collection by extracting and standardizing temporal properties from dataset configuration.
