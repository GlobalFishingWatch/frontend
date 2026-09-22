# apps/data-download-portal/src/components/table/table.tsx · [[data-portal-table-component]] [[hierarchical-file-download-with-survey-integration]] [[virtualized-table-for-large-datasets]]

A virtualized, filterable, sortable, and selectable data table component for browsing and downloading files from datasets with support for nested folder hierarchies and bulk downloads.

- TableData · type · L54-L61 — Defines the shape of a single table row, including file metadata and optional child rows for hierarchical folder structures.
- ExtendedTableState · type · L63-L67 — Combines react-table state interfaces to track global filters, expanded rows, column resizing, and row selection.
- TableInstanceWithHooks · type · L69-L73 — Extends the core react-table instance with props and methods for filtering, sorting, expanding rows, and managing selections.
- ExtendedHeaderGroup · type · L75-L77 — Combines header group with sorting and column resize capabilities for enhanced column header control.
- ExtendedRow · type · L79-L79 — Augments row data with expansion state and selection tracking for UI row rendering.
- IndeterminateCheckboxProps · type · L81-L84 — Defines props for a checkbox component that supports indeterminate state for multi-select row selection.
- fuzzyTextFilterFn · function · L109-L144 — Implements fuzzy text matching across all table cells and nested rows, with recursive parent visibility when child rows match.
- collectAllRows · function · L112-L119 — Recursively flattens all rows and subrows into a single array for filter comparison.
- rowMatches · function · L129-L138 — Determines if a row or any of its descendants match the filter text, ensuring parent visibility when children match.
- HighlightedCellProps · type · L148-L153 — Props interface for a cell component that renders search-term highlights.
- HighlightedCell · function · L155-L170 — Renders a cell value with regex-matched filter text wrapped in `<mark>` tags for visual highlighting.
- TableRowItemProps · type · L172-L178 — Props for a virtualized row component used by react-window to render individual table rows efficiently.
- TableRowItem · function · L180-L214 — Renders a single virtualized table row with cells, supporting row expansion toggles and single-file downloads.
- TableProps · type · L216-L221 — Props interface for the main Table component, including column definitions, data, auth state, and user info.
- Table · function · L223-L449 — Main table component that orchestrates react-table hooks, manages search/filter/sort/select state, and handles single and multi-file downloads with optional survey modal.
