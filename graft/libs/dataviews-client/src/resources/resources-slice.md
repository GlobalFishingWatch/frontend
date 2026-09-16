# libs/dataviews-client/src/resources/resources-slice.ts · [[deck-layer-resource-fetching]]

- ResourcesState · type · L20-L20 — Type alias representing the resources store state as a map of resource keys to Resource objects.
- PartialStoreResources · interface · L21-L23 — Interface defining a partial store shape containing the resources state slice.
- getVesselIdFromDatasetConfig · function · L27-L31 — Extracts the vessel ID from a dataview dataset configuration by searching query or params.
- getTracksChunkSetId · function · L33-L38 — Generates a unique chunk set identifier for track data based on vessel ID and zoom level.
- parseEvent · function · L40-L47 — Transforms API event data by converting ISO timestamp strings to milliseconds and adding a unique key.
- FetchResourceThunkParams · type · L49-L54 — Type definition for parameters passed to the resource fetch async thunk action.
- ParseEventCallback · type · L55-L55 — Callback type for custom event parsing logic invoked during resource fetch.
- ParseTrackCallback · type · L56-L56 — Callback type for custom track GeoJSON parsing logic invoked during resource fetch.
- getChunkSetChunks · function · L127-L136 — Filters and returns all chunk resources belonging to a specific chunk set that have not yet been merged.
- setResource · method · L142-L145 — Reducer action that stores or updates a single resource in the state by its key or URL.
- selectResources · function · L216-L216 — Selector that extracts the resources slice from the store state.
