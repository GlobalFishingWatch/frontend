# libs/api-types/src/datasets.filters.ts · [[api-types-type-definitions]] [[filter-incompatibility-composition-rules]] [[geospatial-filtering-region-hierarchies]]

Defines filter types, configurations, and data structures for dataset filtering with support for multiple filter dimensions including format, unit, and operation constraints.

- DatasetFilterType · type · L24-L24 — Type that represents the allowed filter input types (boolean, coordinate, timestamp, number, range, sql, string).
- FilterType · type · L25-L25 — Type that represents the available dataset filter categories (contextLayers, events, fourwings, tracks, userContextLayers, vessels).
- DatasetFilterFormat · type · L26-L26 — Type that represents the format constraints for filter values (date-time, latitude, longitude).
- DatasetFilterUnit · type · L27-L27 — Type that represents the measurement units for filter values (hours, minutes, km, SI).
- DatasetFilterEnum · type · L28-L28 — Type that represents a list of allowed enumerated values for filter options.
- DatasetFilterOperation · type · L29-L29 — Type that represents comparison operations for filter values (gt, lt, gte, lte).
- DatasetFilter · type · L31-L47 — Type that defines the complete schema for a single dataset filter configuration with label, type, validation rules, and optional metadata.
- DatasetFilters · type · L49-L49 — Type that represents a mapping of filter categories to arrays of filter configurations for a dataset.
