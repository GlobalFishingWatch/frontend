# apps/platform/features/_reports/tabs/activity/ReportActivityGraph.tsx · [[activity-report-ui-components]]

Renders an activity report graph with dynamic component selection, time-series data display, and comparison modes (evolution, before/after, period comparison, or dataset comparison).

- ReportActivityProps · type · L44-L48 — Type definition specifying the props contract for activity graph components with time range and layer time series data.
- SharedGraphType · type · L57-L57 — Type alias that constrains report activity graph types to all variants except dataset comparison for use with the shared graph components.
- ReportActivity · function · L64-L191 — Main export component that orchestrates the activity graph display, handling data loading states, time series computation, and conditional rendering of graph variants with appropriate comparison controls.
