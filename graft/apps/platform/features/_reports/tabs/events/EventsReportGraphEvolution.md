# apps/platform/features/_reports/tabs/events/EventsReportGraphEvolution.tsx · [[event-visualization-hierarchy]] [[events-report-system]] [[redux-report-state]] [[report-data-fetching-hooks]] [[report-time-series-visualization-subsystem]]

Module that renders an interactive timeseries chart showing the evolution of maritime events (encounters, loitering, port visits) over time with aggregated and individual event data views.

- EventsReportGraphEvolutionTooltipProps · type · L32-L45 — Type definition specifying the shape of tooltip data for the aggregated events timeseries chart display.
- AggregatedGraphTooltip · function · L47-L75 — React component that renders a tooltip showing aggregated event counts grouped by date, sorted by value in descending order.
- EventsReportIndividualGraphTooltip · function · L77-L125 — React component that displays detailed information about a specific maritime event including vessel details, event type, and time duration.
- formatDateTicks · function · L127-L136 — Formatter function that converts timestamp ticks into human-readable date strings based on the timeseries interval.
- EventsReportGraphEvolution · function · L137-L215 — Main export component that orchestrates a responsive timeseries chart displaying maritime events, supporting both aggregated summary view and individual event details with optional data download.
