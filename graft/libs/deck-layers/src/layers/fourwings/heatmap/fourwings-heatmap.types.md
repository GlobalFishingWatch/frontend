# libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.types.ts · [[fourwings-heatmap-layer]]

Type definitions and enums for the Fourwings heatmap layer, including data structures for tiles, picking, aggregation modes, and visualization state.

- FourwingsChunk · type · L25-L32 — Represents a temporal chunk of Fourwings data with time bounds and buffered intervals.
- FourwingsAggregationOperation · enum · L34-L38 — Enumeration of aggregation operations (sum, average, average degrees) for cell value computation.
- FourwingsComparisonMode · enum · L40-L47 — Enumeration of comparison modes for visualizing multiple sublayers: compare, bivariate, or time-compare.
- ColorDomain · type · L49-L49 — Type alias for color scale domain represented as a 1D or 2D numeric array.
- ColorRange · type · L50-L50 — Type alias for a color scale range expressed as an array of color objects.
- SublayerColorRanges · type · L51-L51 — Type alias for multiple sublayer color ranges as an array of color range arrays.
- FourwingsHeatmapPickingObject · type · L53-L65 — Picking object for heatmap cells containing feature data, tile coordinates, time bounds, and visualization metadata.
- FourwingsHeatmapPickingInfo · type · L66-L66 — Wrapper type for Deck.GL picking information containing a Fourwings heatmap picking object.
- AggregateCellParams · type · L68-L75 — Parameters for aggregating cell values across a time range using a specified operation.
- CompareCellParams · type · L77-L80 — Parameters for comparing cell values using a specified aggregation operation.
- FourwingsHeatmapResolution · type · L82-L82 — Enumeration of heatmap tile rendering resolutions: low, default, or high.
- FourwingsHeatmapTileData · type · L83-L83 — Type alias for heatmap tile data as an array of Fourwings features.
- FourwingsIntervalCacheMode · type · L84-L84 — Enumeration of cache modes for managing time interval data: DATE or NONE.
- _FourwingsHeatmapTileLayerProps · type · L86-L102 — Generic base type for Fourwings heatmap tile layer configuration including data, resolution, comparison mode, and visualization options.
- FourwingsHeatmapTileLayerProps · type · L104-L105 — Public tile layer properties combining base Fourwings properties with Deck.GL TileLayerProps.
- FourwingsHeatmapTilesCache · type · L107-L116 — Cache metadata tracking zoom level, time range, buffering, and temporal aggregation state for heatmap tiles.
- FourwinsTileLayerScale · type · L118-L118 — Type alias for a D3 linear scale mapping Fourwings color objects across a continuous domain.
- FourwingsTileLayerState · type · L119-L129 — Layer state object holding rendering state, color scales, cache, domain/range, and viewport loading status.
- FourwingsHeatmapLayerProps · type · L131-L139 — Properties for instantiating a Fourwings heatmap layer with tile data, color configuration, and caching.
- FourwingsVectorsLayerProps · type · L141-L151 — Properties for instantiating a Fourwings vector flow layer with vector sublayers, velocity, and highlighting options.
- _FourwingsHeatmapStaticLayerProps · type · L153-L153 — Base static layer properties derived from tile layer props, excluding dynamic data.
- FourwingsHeatmapStaticLayerProps · type · L155-L156 — Public static layer properties combining base static props with Deck.GL TileLayerProps.
