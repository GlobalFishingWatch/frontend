# apps/platform/features/_map/timebar/timebar.utils.ts · [[timebar-utility-pipeline]]

- GetGraphDataFromFourwingsFeaturesParams · type · L26-L35 — Parameter type that specifies the core temporal and layer filtering options required for converting fourwings features to graph data.
- FeatureDates · type · L37-L37 — Record type that maps timestamps to timeseries frames with optional sublayer counts.
- getDatesPopulated · function · L38-L87 — Initializes a complete timeseries data structure with zero-filled entries for every interval between start and end dates.
- getGraphDataFromFourwingsPositions · function · L89-L119 — Aggregates fourwings position features into a timeseries by binning their values into interval-based buckets by layer.
- getGraphDataFromPoints · function · L121-L247 — Accumulates point features with time ranges into timeseries frames, distributing multi-interval feature values across overlapping date buckets.
- findOverlappingIndex · function · L154-L192 — Binary search helper that locates which date boundary bucket a given timestamp falls into, handling edge cases for interval start and end matching.
- getGraphDataFromFourwingsHeatmap · function · L249-L395 — Transforms fourwings heatmap features into timeseries data with support for aggregation operations, extent anchoring, and optional comparison periods.
- getLegendColorScale · function · L397-L404 — Creates a linear color scale function that interpolates RGBA colors across a numeric domain for legend rendering.
