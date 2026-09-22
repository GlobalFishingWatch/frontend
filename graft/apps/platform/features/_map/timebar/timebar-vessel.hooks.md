# apps/platform/features/_map/timebar/timebar-vessel.hooks.ts · [[dataviews-datasets-state]] [[deck-layer-integration]] [[redux-caching-pattern]] [[timebar-data-fetching-hooks]]

A hooks module that manages vessel track data, graph visualization, and event timeline data for timebar display in the map feature.

- isVesselLayerInstance · function · L33-L34 — Type guard that determines whether a layer instance is a VesselLayer (as opposed to UserTracksLayer) based on the presence of the getVesselTrackSegments method.
- getUserTrackHighlighterLabel · function · L36-L38 — Extracts the user track ID from a highlighter event chunk to display as a label.
- hasUniqueChunks · function · L40-L42 — Checks whether track segments contain unique chunk identifiers to determine if vertical offset is needed in the timebar visualization.
- hasTracksWithNoData · function · L44-L51 — Determines if any vessel tracks have finished loading but contain no chunk data.
- useVesselTracksLayers · function · L53-L60 — Hook that retrieves deck layer instances for all vessel-related dataviews configured in the timebar.
- useTimebarTracksLayers · function · L62-L69 — Hook that retrieves deck layer instances for all track-related dataviews (both vessel and user tracks) in the timebar.
- useTimebarLayers · function · L71-L79 — Hook that selects the appropriate track layers (vessel-only or mixed) based on whether the current timebar graph displays speed/elevation or other metrics.
- useTimebarVesselTracksData · function · L82-L84 — Hook that retrieves cached vessel track chart data from Jotai atom state.
- TimebarChartDataProps · type · L86-L86 — Type defining display properties for timebar chart segments (vertical offset and color).
- VesselTrackAtom · type · L87-L87 — Type alias for the Jotai atom state shape holding vessel track chart data.
- useTimebarVesselTracks · function · L88-L201 — Hook that transforms raw deck layer track segments into timebar chart data structure, handling color updates and unique chunk detection.
- getTrackGraphSpeedHighlighterLabel · function · L205-L206 — Formats a speed value (in knots) for display in the timebar graph highlighter tooltip.
- getTrackGraphElevationighlighterLabel · function · L210-L211 — Formats an elevation value (in meters, displayed as absolute) for display in the timebar graph highlighter tooltip.
- useTimebarVesselTracksGraph · function · L213-L344 — Hook that builds speed/elevation graph chart data from vessel tracks with real-time point values, limited to 1–2 vessels and restricted by graph type and layer filters.
- getTrackEventHighlighterLabel · function · L346-L358 — Generates a human-readable label for vessel events in the timebar, showing event description and cluster count when applicable.
- useTimebarVesselEvents · function · L360-L416 — Hook that aggregates filtered vessel events from all loaded layers into timebar chart items with event-specific data source metadata.
