# apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts · [[deckgl-layer-integration]] [[timebar-activity-hook]] [[workspace-redux-state]]

Custom React hooks module that computes timebar activity graph data from fourwings deck layers, handling both position-based and heatmap-based visualizations with color scaling and viewport-aware caching.

- useHeatmapActivityGraph · function · L44-L162 — Custom hook that fetches and processes Fourwings layer viewport data into timebar activity frames based on visualization mode and viewport state.
- setFourwingsPositionsData · function · L102-L111 — Transforms raw Fourwings position features into timebar activity frames using chunk bounds and layer sublayer configuration.
- setFourwingsHeatmapData · function · L113-L127 — Converts Fourwings heatmap values into timebar activity frames or resets to empty data based on whether input data exists.
