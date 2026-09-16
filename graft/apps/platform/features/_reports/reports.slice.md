# apps/platform/features/_reports/reports.slice.ts · [[report-crud-operations]]

Redux slice for managing report data fetching, creation, updating, and deletion with async thunks and selectors.

- ReportState · type · L144-L144 — Type alias representing the async reducer state shape for a single Report entity.
- ReportsSliceState · type · L145-L145 — Type alias defining the Redux state shape that nests a ReportState under the reports key.
- selectAllReports · function · L163-L165 — Selector that retrieves all reports from the Redux state by delegating to the entity adapter.
- selectReportsStatus · function · L171-L171 — Selector that retrieves the current async loading status of the reports slice.
- selectReportsStatusId · function · L172-L172 — Selector that retrieves the status identifier associated with the most recent reports operation.
