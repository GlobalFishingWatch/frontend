# apps/platform/features/_reports/tabs/events/EventsReportGraphGrouped.tsx · [[event-visualization-hierarchy]] [[events-report-system]] [[redux-report-state]] [[report-data-fetching-hooks]] [[report-time-series-visualization-subsystem]]

Renders a grouped bar chart visualization of fishing events (by flag, RFMO, FAO, or EEZ) with aggregated and individual data modes, interactive category filtering, and downloadable results.

- EventsReportGraphGroupedTooltipProps · type · L46-L59 — Type definition for props passed to the aggregated graph tooltip component displaying event data.
- AggregatedGraphTooltip · function · L61-L120 — React component that renders a tooltip for aggregated bar chart data, showing event counts grouped by category with special handling for overflow categories.
- ReportGraphTick · function · L122-L227 — React component that renders interactive x-axis labels for the bar chart, enabling filtering or navigation when clicked on non-other categories.
- onLabelClick · function · L135-L186 — Async handler that filters the dataview by flag or navigates to an area-specific report when a chart category label is clicked.
- EventsReportGraphGrouped · function · L229-L344 — Main React component that renders a grouped bar chart visualization for events data with support for switching between aggregated and individual event views.
