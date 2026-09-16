# apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts · [[dataset-metadata-configuration-path]] [[dataset-upload-and-parsing]] [[geometry-specific-metadata-extraction-and-validation]] [[geospatial-data-transform-contracts]] [[timestamp-property-consistency-across-upload-path]]

Utility module providing functions to extract, validate, and transform dataset metadata from various data formats (GeoJSON, gridded, tracks, points, polygons) for dataset upload workflows.

- getDatasetMetadataValidations · function · L45-L56 — Validates dataset metadata by checking that the name is present and meets minimum length requirements.
- ExtractMetadataProps · type · L58-L62 — Type definition for extraction parameters containing dataset name, source file format, and raw data.
- getMetadataFromDataset · function · L64-L76 — Extracts displayable metadata fields from a Dataset entity for use in the upload interface.
- getBaseDatasetMetadata · function · L78-L96 — Creates base dataset metadata with derived filter layers and standard context dataset configuration.
- getTracksDatasetMetadata · function · L98-L117 — Generates complete metadata for track-type datasets by inferring latitude, longitude, and timestamp columns.
- getPointsDatasetMetadata · function · L119-L145 — Generates complete metadata for point-type datasets with coordinate and timestamp field inference and non-GeoJSON data handling.
- GriddedSourceFormat · type · L147-L147 — Type constraint limiting gridded dataset source formats to GeoTIFF or NetCDF.
- getGriddedDatasetMetadata · function · L149-L178 — Generates metadata for gridded raster datasets with optional NetCDF variable selection.
- getPolygonsDatasetMetadata · function · L180-L209 — Generates complete metadata for polygon-type datasets with timestamp validation and context layer configuration.
- getFinalDatasetFromMetadata · function · L211-L242 — Converts UI-layer dataset metadata into a clean backend Dataset entity with sanitized filters and derived date ranges.
- getPropertiesIdClean · function · L244-L255 — Sanitizes GeoJSON feature properties by normalizing property keys according to filter naming conventions.
- parseGeoJsonProperties · function · L256-L306 — Transforms GeoJSON features by cleaning properties, converting timestamps to milliseconds, and unioning multi-geometry collections into single geometries.
