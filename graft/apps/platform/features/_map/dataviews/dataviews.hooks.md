# apps/platform/features/_map/dataviews/dataviews.hooks.ts · [[dataviews-management]] [[deprecated-dataview-migration-registry]]

React hooks module for managing dataview migration from deprecated to latest versions with dataset and filter support.

- normalizeDataviewFilters · function · L32-L41 — Normalizes dataview filters by removing undefined values and sorting array filters for consistent comparison.
- areDataviewFiltersEqual · function · L43-L46 — Compares two dataview filter objects for deep equality after normalization.
- areDataviewSourcesEqual · function · L48-L49 — Compares two arrays of dataset source IDs for equality after sorting.
- getSupportedFilters · function · L51-L68 — Filters dataview configuration filters to include only those supported by the dataview and dataset combination.
- useMigrateToLatestDataview · function · L75-L239 — React hook providing migration utilities to upgrade deprecated dataview instances to their latest versions while preserving filters and configurations.
