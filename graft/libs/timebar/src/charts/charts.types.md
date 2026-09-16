# libs/timebar/src/charts/charts.types.ts · [[timebar-chart-types]]

Type definitions for timebar charts, events, and visualization configuration.

- TrackChunkProps · type · L12-L16 — Configurable properties for individual track visualization chunks including identifier, color, and height.
- TrackEventChunkProps · type · L18-L25 — Event chunk properties defining visual appearance and geospatial coordinates for tracked events.
- TimebarChartValue · type · L27-L32 — Data point structure representing a timestamped measurement in the timebar chart with optional aggregations.
- TimebarChartChunkCluster · type · L34-L37 — Groups multiple chunk identifiers and their count for clustered rendering at high zoom levels.
- TimebarChartChunk · type · L39-L54 — Core atomic unit of timebar visualization representing a time-bounded segment with rendering dimensions, event metadata, and optional clustering.
- HighlighterCallbackFnArgs · type · L56-L62 — Arguments passed to highlighter callback functions containing the chunk, value, and item context for interactive highlighting.
- HighlighterCallbackFn · type · L64-L64 — Function type that determines dynamic highlight labels based on chunk and value context.
- HighlighterCallback · type · L65-L65 — Union type allowing static or dynamic highlight label resolution.
- HighlighterIconCallback · type · L66-L66 — Function or static icon type for resolving custom icon display in highlighter tooltips.
- HighlighterDateCallback · type · L68-L68 — Function type for formatting timestamps into display-ready date strings in highlighter tooltips.
- TimebarChartItem · type · L70-L86 — Complete data structure for a single timebar row, aggregating chunks with color, status, filters, and interaction callbacks.
- TimebarChartData · type · L88-L88 — Array type representing all chart items of a given generic type.
- ChartType · type · L90-L90 — Enumeration of available timebar chart types for categorizing different visualization modes.
- TimebarChartsData · type · L92-L92 — Unified data structure mapping each chart type to its data and active status.
- HighlightedChunks · type · L94-L94 — Sparse map of highlighted chunk identifiers keyed by chart type for selective visual emphasis.
- Timeseries · type · L96-L96 — Array of timestamped data points with optional frame indices and numeric values for time-series visualization.
- ActivityTimeseriesFrame · type · L98-L98 — Single frame in an activity time series containing date, optional counts, and numeric key-value pairs.
- TimebarColorScale · type · L100-L100 — Optional function type that maps numeric values to deck.gl colors for gradient-based chunk styling.
