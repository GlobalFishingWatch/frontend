# apps/platform/features/_reports/reports-timeseries.hooks.ts · [[client-side-deduplication-memoization]] [[report-timeseries-pipeline]]

Exports React hooks and utilities for computing, tracking, and filtering time-series reporting data from deck layer instances, including feature filtering by polygon geometry and statistical calculations.

- EvolutionGraphData · interface · L67-L72 — Data structure that represents a point in an activity evolution timeline with date and statistics for graphing.
- ReportSublayerGraph · interface · L74-L80 — Configuration object describing a single sublayer's visual and metric properties for report graphs.
- ReportGraphMode · type · L82-L82 — Discriminator type distinguishing whether a report graph displays timeline evolution, time-period comparison, or is in loading state.
- getReportGraphMode · function · L84-L88 — Converts a high-level report activity graph type into its corresponding display mode for the UI.
- ReportGraphProps · interface · L90-L96 — Props object that aggregates all data needed to render a complete report graph including timeseries, sublayer metadata, and temporal interval.
- FourwingsReportGraphStats · type · L98-L103 — Statistics type for fourwings cell-based layer data containing minimum, maximum, and mean value aggregates.
- PointsReportGraphStats · type · L105-L110 — Statistics type for point-based layer data containing total count and individual point values.
- PolygonsReportTopArea · type · L112-L118 — Data structure representing a single polygon area ranked by activity with its identifier, feature geometry, and coverage metrics.
- PolygonsReportGraphStats · type · L120-L129 — Statistics type for polygon-layer data tracking contained and overlapping features with optional area coverage and top-area rankings.
- ReportGraphStats · type · L131-L134 — Keyed dictionary of statistics aggregating metrics across all layers in a report, supporting fourwings, points, and polygon types.
- ReportState · interface · L136-L141 — Global Jotai atom state containing loading status, timeseries data, filtered features, and computed statistics for the active report.
- useTimeseriesStats · function · L154-L156 — Hook that retrieves pre-computed statistics for the current report from global state.
- useReportInstances · function · L158-L188 — Hook that merges active report dataviews and comparison dataviews into layer instances based on report category and dataset filtering logic.
- useReportFeaturesLoading · function · L190-L192 — Hook that exposes whether features are currently being filtered and processed for the report.
- getFeaturesFilteredByArea · function · L204-L276 — Filters layer features by an area geometry, handling transitional layer states and applying appropriate polygon/cell filtering modes per instance type.
- useReportTimeseries · function · L278-L461 — Core hook that orchestrates fetching, filtering, and computing timeseries and statistics when report layers, area, or time parameters change.
- processFeatures · function · L385-L421 — Async function that executes feature filtering, timeseries extraction, and stats computation with error handling and state rollback.
- useComputeReportTimeSeries · function · L464-L467 — Entrypoint hook that triggers timeseries computation for the entire report when component mounts or report instances change.
- useReportTimeSeriesErrors · function · L469-L472 — Hook that extracts and formats error messages from filtered feature results to expose processing failures.
- useReportFilteredTimeSeries · function · L475-L508 — Hook that applies timebar-based filtering to timeseries data, respecting interval normalization and time-comparison mode settings.
- useReportFilteredFeatures · function · L510-L512 — Hook that retrieves the latest polygon/cell-level filtered features from the report state.
