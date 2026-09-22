# apps/platform/features/_vessels/search/advanced/SearchAdvancedFilters.tsx · [[debounced-query-execution]] [[multi-filter-advanced-search]] [[permission-based-dataset-filtering]] [[vessel-search-system]]

Module providing an advanced search interface for filtering vessels by identity source, datasets, schemas, and transmission date ranges.

- ImcompatibleFilter · type · L52-L52 — Type definition representing a filter ID and its incompatible values for validation logic.
- IncompatibleFilterSelection · type · L53-L56 — Type definition mapping a filter to its list of incompatible filter constraints.
- getIncompatibleFiltersBySelection · function · L64-L68 — Returns filters that are incompatible with the given filter ID and selected values.
- isIncompatibleFilterBySelection · function · L70-L83 — Checks whether a schema filter is incompatible with the current filter selections.
- SearchAdvancedFilters · function · L85-L347 — React component rendering advanced vessel search filters including info source selection, dataset sources, schema-based filters, and transmission date range inputs.
