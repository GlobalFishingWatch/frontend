# apps/track-labeler/src/features/map/map.hooks.ts · [[map-rendering-visualization-layer]] [[viewport-state-management-via-jotai-atoms]]

- useMapHover · function · L21-L44 — Hook that manages cursor state and dispatches ruler position updates when hovering over the map.
- useMapClick · function · L46-L78 — Hook that handles map click events to either select track features or edit ruler coordinates.
- LatLon · type · L80-L83 — Type definition for latitude and longitude map coordinates.
- HighlightedTime · type · L84-L84 — Type definition for a time range with start and end string timestamps.
- useMapViewState · function · L92-L94 — Hook that retrieves the current map view state including longitude, latitude, and zoom level.
- useMapSetViewState · function · L95-L104 — Hook that returns a throttled function to update map view state coordinates at a limited rate.
- useHiddenLabelsConnect · function · L106-L123 — Hook that manages the visibility state of map labels and syncs changes to query parameters.
- dispatchHiddenLabels · function · L110-L120 — Function that toggles label visibility by adding or removing labels from the hidden set and updating query parameters.
- useSetMapInstance · function · L127-L134 — Hook that stores the DeckGL map instance reference in Jotai atom state for global access.
- useDeckMap · function · L136-L138 — Hook that retrieves the stored DeckGL map instance from Jotai atom state.
