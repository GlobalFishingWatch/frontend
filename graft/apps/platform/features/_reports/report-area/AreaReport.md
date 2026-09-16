# apps/platform/features/_reports/report-area/AreaReport.tsx · [[area-report-ui-components]] [[map-viewport-and-timebar-integration]]

A React component that renders a tabbed report interface for analyzing area data across multiple categories (activity, detections, events, environment, others) with dynamic tab visibility based on available dataviews and status handling.

- ReportTabContent · function · L49-L63 — Selects and renders the appropriate report component based on the requested category.
- Report · function · L65-L209 — Main report component that manages tab navigation, data fetching, workspace state validation, and renders category-specific report content with timebar synchronization.
- handleTabClick · function · L163-L176 — Handles tab selection by resetting report data, updating the URL query params, and tracking the analytics event for report category changes.
