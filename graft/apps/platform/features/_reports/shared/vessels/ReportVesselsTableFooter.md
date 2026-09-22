# apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx · [[report-visualization-components]]

Module that renders a paginated footer for the vessel report table with download and filtering controls.

- ReportVesselsTableFooterProps · type · L41-L43 — Props interface defining an optional activity unit parameter for the footer component.
- ReportVesselsTableFooter · function · L45-L237 — Main React component that renders pagination controls, vessel list statistics, and action buttons for downloading and managing vessel groups.
- onDownloadVesselsClick · function · L76-L120 — Exports the current vessel list as a CSV file with metadata including MMSI, flag, vessel type, and activity metrics.
- onPrevPageClick · function · L122-L124 — Navigation handler that decrements the current pagination page number.
- onNextPageClick · function · L125-L127 — Navigation handler that increments the current pagination page number.
- onShowMoreClick · function · L128-L137 — Handler that increases the number of vessels displayed per page and resets to the first page.
- onShowLessClick · function · L138-L147 — Handler that decreases the number of vessels displayed per page and resets to the first page.
- onAddToVesselGroup · function · L149-L156 — Event tracker that records when a user initiates adding vessels to a vessel group from the report.
