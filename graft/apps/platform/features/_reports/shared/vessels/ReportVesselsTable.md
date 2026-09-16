# apps/platform/features/_reports/shared/vessels/ReportVesselsTable.tsx · [[report-visualization-components]]

Renders a sortable, filterable table of vessels with their identity, flag state, type, and activity metrics, enabling users to navigate to individual vessel profiles and manage vessel pinning.

- ReportVesselTableProps · type · L43-L47 — Defines the prop contract for the ReportVesselsTable component.
- ReportVesselsTable · function · L49-L309 — Renders an interactive table of vessels with sortable columns, filter buttons, vessel pins, and activity unit values, while validating dataset permissions and workspace readiness.
- onFilterClick · function · L78-L80 — Applies a vessel filter and resets pagination to the first page.
- handleSortClick · function · L82-L90 — Updates the table sort order by property and direction in the query parameters.
- onPinClick · function · L92-L98 — Tracks analytics when a user pins a vessel for map visualization.
