# apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx · [[vessel-search-system]] [[virtualized-results-table]]

Renders a virtualized table of vessel search results with filtering, column customization, and bulk selection capabilities.

- SearchTable · type · L91-L91 — Type alias for a TanStack ReactTable configured with vessel identity data.
- VesselDataviewRef · type · L92-L92 — Type representing a minimal reference to a vessel dataview with optional info configuration.
- isVesselInWorkspace · function · L94-L102 — Checks whether a vessel already exists in the current workspace via dataview comparison.
- canSelectVessel · function · L104-L114 — Determines if a vessel can be selected based on workspace presence and self-reported identity availability.
- columnSizeStyle · function · L116-L118 — Generates a CSS style object for dynamic column width using CSS custom properties.
- SelectAllCheckbox · function · L120-L144 — Renders a checkbox input for selecting/deselecting all vessels in the results table.
- SearchAdvancedResultRow · function · L146-L181 — Renders a single virtualized table row with vessel data cells and selection support.
- SearchAdvancedResultsBody · function · L183-L230 — Renders the virtualized table body with dynamic row sizing and row height measurement.
- SearchAdvancedResults · function · L232-L760 — Main component that orchestrates an advanced vessel search results table with column resizing, ordering, and vessel selection.
- writeColumnSizeVars · function · L638-L646 — Updates CSS custom properties on the table element to synchronize column widths with TanStack table state.
