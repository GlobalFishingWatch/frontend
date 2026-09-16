# libs/data-transforms/src/schema/schema.ts · [[coordinate-and-date-parsing-utilities]] [[filter-schema-inference-engine]] [[property-key-normalization]] [[schema-detection-and-inference]]

Module that provides utilities for extracting, normalizing, and filtering dataset schema information from GeoJSON and list data sources.

- GetFieldFilterParams · type · L17-L20 — Configuration type for controlling whether enums are included in field filters and setting the maximum allowed enum values.
- getFilterIdClean · function · L27-L34 — Converts filter IDs to snake_case format while preserving the special coordinates properties ID.
- normalizePropertiesKeys · function · L36-L45 — Normalizes all keys in an object to snake_case format for consistent property naming.
- getTimestampEnum · function · L47-L53 — Extracts and returns the minimum and maximum timestamps from a sorted array of date values.
- getFieldFilter · function · L55-L127 — Infers the appropriate filter type for a dataset field based on its values and optionally generates enum ranges or value lists.
- getDatasetFiltersClean · function · L129-L136 — Normalizes filter IDs to snake_case and ensures all filters have a label before returning.
- getDatasetConfigurationClean · function · L148-L166 — Normalizes specified frontend configuration keys to snake_case while preserving non-string configuration values.
- getDatasetFiltersFromGeojson · function · L168-L186 — Extracts dataset filters from GeoJSON feature properties by inferring filter types from unique values in each field.
- ListedData · type · L188-L188 — Type alias representing an array of objects for tabular data format.
- getDatasetFiltersFromList · function · L189-L207 — Extracts dataset filters from tabular list data by inferring filter types from unique values in each field.
- getDatasetFilters · function · L209-L219 — Unified entry point that routes data to either GeoJSON or list-based filter extraction based on data format.
