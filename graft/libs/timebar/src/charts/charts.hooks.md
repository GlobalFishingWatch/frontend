# libs/timebar/src/charts/charts.hooks.ts · [[timebar-chart-hooks-data-transformation]]

- filterData · function · L21-L41 — Filters chart data chunks to only include those overlapping a specified date range.
- clusterData · function · L45-L100 — Groups adjacent chart chunks by type and pixel proximity to reduce visual clutter.
- useDelta · function · L102-L106 — Computes the time span in milliseconds between the outer timeline boundaries.
- useOuterScale · function · L108-L115 — Memoizes a d3 time scale mapping the outer timeline domain to pixel range.
- useTimebarTimeOrigin · function · L117-L120 — Returns the millisecond timestamp of the overall timeline's earliest point.
- useClusteredChartData · function · L122-L130 — Memoizes clustered chart data, re-computing only when the time delta changes.
- sortChunksByType · function · L141-L145 — Comparator function that orders chunks by predefined event type priority.
- sortDataByType · function · L147-L154 — Sorts all chunks within each chart item by event type priority.
- sortDataByTime · function · L156-L165 — Sorts all chunks within each chart item chronologically by start time.
- useSortedChartData · function · L167-L172 — Memoizes chart data sorted by type or time, defaulting to type-based ordering.
- useTimeseriesToChartData · function · L174-L208 — Transforms activity timeseries frames and dataviews into chart items with values and metadata.
