# apps/track-labeler/src/features/map/map-layers.hooks.ts · [[deck-gl-layer-composition-system]]

Module that exports React hooks for composing and managing deck layer instances used in the map visualization of the track labeler.

- useTrackLabelerDeckLayer · function · L17-L66 — Composes a TrackLabelerVesselLayer with direction point data, filtering labels by visibility and highlighting points within the selected time window.
- useMapRulerInstance · function · L68-L78 — Creates a RulersLayer instance from persisted rulers state to display measurement and distance tools on the map.
- useMapDataviewLayers · function · L80-L96 — Composes contextual background layers using the deck layer composer with a fixed historical time range.
- useMapDeckLayers · function · L98-L108 — Aggregates all map layers—labeler vessel points, rulers, and contextual dataviews—into a single filtered array for rendering.
