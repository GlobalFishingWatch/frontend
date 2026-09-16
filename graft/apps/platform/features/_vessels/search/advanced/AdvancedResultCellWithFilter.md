# apps/platform/features/_vessels/search/advanced/AdvancedResultCellWithFilter.tsx · [[inline-filter-application]] [[vessel-search-system]]

React component that wraps vessel search result cells with a filter button to add column values to the active search filters.

- AdvancedResultCellWithFilterProps · type · L16-L22 — Defines the props contract for a vessel result cell that supports clicking to add filter values, including the vessel identity data, column property, and optional callback.
- AdvancedResultCellWithFilter · function · L24-L63 — Renders a vessel search result cell optionally wrapped with a filter button, applying column-specific formatting logic (splitting comma-separated owner values or wrapping single values in arrays) before updating the search filter state.
