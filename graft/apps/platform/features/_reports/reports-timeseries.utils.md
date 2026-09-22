# apps/platform/features/_reports/reports-timeseries.utils.ts · [[graceful-degradation-fallback-behavior]] [[report-timeseries-pipeline]] [[spatial-geometry-assumptions]]

Utility module for computing and filtering timeseries statistics across polygon, points, and fourwings deck layers in report generation.

- ReportFourwingsDeckLayer · type · L43-L43 — Type alias for a deck layer displaying fourwings activity data.
- ReportPointsDeckLayer · type · L44-L44 — Type alias for a deck layer displaying user-defined point features.
- ReportPolygonsDeckLayer · type · L45-L45 — Type alias for a deck layer displaying user-defined context polygons.
- ReportDeckLayer · type · L46-L47 — Union type representing any supported report deck layer (fourwings, points, or polygons).
- GetTimeseriesParams · type · L49-L52 — Generic parameter type for functions that retrieve timeseries data from filtered features and layer instances.
- isInstanceOfPointsLayer · function · L54-L56 — Type guard that checks if a deck layer is a points layer.
- isInstanceOfPolygonLayer · function · L58-L60 — Type guard that checks if a deck layer is a polygon layer.
- GetPolygonsStatsParams · type · L64-L70 — Parameter type for polygon statistics computation, bundling features, report area geometry, and sublayer filters.
- getFeatureCount · function · L77-L80 — Returns the source area count a feature represents, accounting for pre-aggregated features from tilesets.
- getFeaturesCount · function · L82-L84 — Sums the source area counts across multiple features.
- getCountsBySublayer · function · L86-L96 — Computes per-sublayer feature counts by filtering features against each sublayer's filter rules.
- getPolygonsTimeseriesStats · function · L98-L241 — Computes polygon coverage statistics including area ratios, total covered area, and the top-10 most covered individual polygons within a report area.
- addTopArea · function · L147-L160 — Accumulates polygon features into top-area candidates, computing their area only when they are single source areas.
- getTimeseries · function · L243-L269 — Assembles timeseries data for all layers in a report by dispatching to type-specific extraction functions.
- GetTimeseriesStatsParams · type · L271-L275 — Parameter type for timeseries statistics that extends base timeseries params with time range and report geometry.
- getTimeseriesStats · function · L277-L320 — Computes aggregated timeseries statistics for all layers in a report within a given time range.
- filterTimeseriesByTimerange · function · L322-L347 — Filters timeseries data points to a specified date range, discarding zero-only entries outside the range.
