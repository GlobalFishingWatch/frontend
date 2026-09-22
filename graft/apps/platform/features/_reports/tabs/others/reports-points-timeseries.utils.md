# apps/platform/features/_reports/tabs/others/reports-points-timeseries.utils.ts · [[point-aggregation-and-filtering]] [[report-others-tab-system]]

Utility module that converts geospatial point features into time-series data for report visualization and analysis.

- PointsFeaturesToTimeseriesParams · type · L18-L26 — Parameter object type defining time range, interval, and layer configuration needed to convert point features into timeseries data.
- pointsFeaturesToTimeseries · function · L28-L71 — Transforms filtered point features into timeseries graph data by extracting point values across specified time intervals and organizing them by sublayer.
- GetPointsTimeseriesParams · type · L73-L76 — Parameter object type bundling filtered point features and their deck layer instance for timeseries or statistical extraction.
- getPointsTimeseries · function · L78-L108 — Extracts time properties and interval from a deck layer instance to generate formatted timeseries graph data from contained point features.
- getPointsTimeseriesStats · function · L110-L146 — Aggregates point feature values across time filters to compute total count and per-index value statistics for report summaries.
