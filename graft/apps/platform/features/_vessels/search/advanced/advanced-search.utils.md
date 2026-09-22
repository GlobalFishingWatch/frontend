# apps/platform/features/_vessels/search/advanced/advanced-search.utils.ts · [[filter-validation-error-handling]] [[multi-filter-advanced-search]] [[permission-based-dataset-filtering]] [[vessel-search-system]]

Utility module providing helper functions and constants for advanced vessel search query construction and dataset field validation.

- getSearchDataview · function · L32-L52 — Constructs a DataviewWithFilters object from search filters and datasets, mapping schema filter IDs to their corresponding search state values.
- isDatasetSearchFieldNeededSupported · function · L60-L69 — Validates whether a dataset supports at least one of the required search fields for advanced vessel search queries.
