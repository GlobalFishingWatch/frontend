# libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.utils.ts · [[coordinate-filtering-bounds]] [[directional-data-handling]] [[fourwings-heatmap-utilities]] [[null-vs-zero-distinction]] [[per-sublayer-visibility-filtering]] [[temporal-aggregation-caching]]

Utility module providing data aggregation, tile URL generation, cell filtering, color domain computation, and cache management for fourwings heatmap visualization.

- aggregateSublayerValues · function · L43-L71 — Aggregates multiple time-series cell values into a single number using sum, average, or circular average (degrees) operation.
- getCellValuesFrameRange · function · L73-L90 — Converts temporal frame bounds into array slice indices, clamping to valid data range.
- sliceCellValues · function · L92-L113 — Extracts a time-windowed subset of values from a cell's time series.
- aggregateCell · function · L118-L148 — Reduces per-sublayer time-series data to aggregated values per sublayer within a time window, returning undefined for empty sublayers.
- compareCell · function · L150-L170 — Computes the difference between aggregated values of two consecutive time periods for change visualization.
- stringHash · function · L172-L174 — Produces a stable hash code from a string for consistent array indexing.
- getURLFromTemplate · function · L176-L204 — Substitutes tile coordinates into a URL template, with load-balancing support for array templates and backward-compatible tile Y-coordinate inversion.
- GetDataUrlParams · type · L206-L219 — Parameter object type for constructing API requests to fetch heatmap tile data.
- getTimeResolved · function · L221-L232 — Converts a timestamp to an ISO date or hour string, respecting cache interval granularity (date, hour, or full ISO).
- getDataUrl · function · L234-L288 — Constructs a complete heatmap tile API request URL with dataset, vessel group, filter, and date-range parameters.
- Bounds · interface · L290-L295 — Geographic boundary container specifying north, south, east, and west extent limits.
- filterCellsByBounds · function · L297-L319 — Filters heatmap cells to those intersecting a geographic bounding box, handling world-wrap edge cases.
- getFourwingsChunk · function · L323-L336 — Resolves the optimal time interval for a date range and computes buffered chunk boundaries.
- FourwingsIntervalFrames · type · L338-L343 — Container for frame-index mappings that translate wall-clock time into data array positions.
- getIntervalFrames · function · L348-L382 — Computes the frame indices for a time range within a selected interval, caching results to avoid redundant calculations.
- isSublayerValueVisible · function · L384-L397 — Type guard checking that a value is a valid, non-null number within optional visibility bounds.
- getSublayersVisibleValuesHash · function · L399-L403 — Creates a compact cache key from sublayer min/max visibility thresholds.
- filterCells · function · L405-L410 — Selects 5% of cells for efficient color domain sampling, optionally filtered by value range.
- getFourwingsColorDomain · function · L412-L466 — Derives a color scale domain from a feature set by aggregating values, sampling, filtering outliers, and computing histogram steps.
- getResolutionByVisualizationMode · function · L468-L477 — Maps a visualization mode identifier to a tile resolution tier (high, low, or default).
- getVisualizationModeByResolution · function · L479-L486 — Maps a tile resolution tier back to its corresponding visualization mode constant.
- getZoomOffsetByResolution · function · L488-L495 — Determines tile zoom level adjustment based on resolution tier and current zoom value.
- getTileDataCache · function · L497-L542 — Assembles a cache key object containing resolved time interval, chunks, and comparison parameters for tile fetch coordination.
