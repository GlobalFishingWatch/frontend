# libs/datasets-client/src/datasets.filters.ts · [[dataset-configuration-and-filtering]]

Provides utility functions for querying and validating dataset filter configurations, including flattening filter hierarchies, checking filter availability, and matching filters against allowed field names.

- getFlattenDatasetFilters · function · L11-L19 — Flattens nested dataset filters structure into a single array of filter definitions.
- getDatasetFiltersAllowed · function · L21-L27 — Extracts the IDs of all enabled filters available for a given dataset.
- getDatasetFilterItem · function · L29-L43 — Retrieves the filter configuration object for a specific filter type within a dataset.
- datasetHasFilter · function · L45-L67 — Determines whether a dataset supports a given filter based on its configuration and type constraints.
- isFilterInFiltersAllowed · function · L69-L88 — Checks if a filter is present in an allowed filters list, accounting for source-prefixed and mapped filter names.
- datasetHasFilterAllowed · function · L90-L95 — Verifies whether a dataset permits a specific filter according to its allowed filters configuration.
