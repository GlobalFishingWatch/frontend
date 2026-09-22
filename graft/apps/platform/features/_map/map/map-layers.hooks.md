# apps/platform/features/_map/map/map-layers.hooks.ts · [[dataview-state-management]] [[loading-state-aggregation]] [[map-layers]]

Collection of React hooks for composing and managing map visualization layers including dataviews, overlays, and configuration.

- useActivityDataviewId · function · L69-L82 — Resolves the appropriate dataview ID for a given dataview based on its category (Activity, Detections, or Environment).
- useGlobalConfigConnect · function · L84-L182 — Assembles the global deck.gl layer composer configuration from workspace settings, time ranges, visualization modes, and events.
- useMapDataviewsLayers · function · L184-L224 — Composes deck.gl layers for workspace dataviews using the global config, handling different location contexts and loading states.
- useHotspotOverlayLayer · function · L226-L244 — Creates a deck.gl polygon layer overlay for report hotspot geometry when enabled.
- useMapOverlayLayers · function · L246-L256 — Collects and filters all overlay layers (draw, rulers, hotspots, pending draws) into a single array.
- useMapLayers · function · L258-L264 — Combines dataview layers and overlay layers into a unified array for map rendering.
