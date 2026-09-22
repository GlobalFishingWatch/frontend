# apps/platform/features/_map/map/map-viewport.hooks.ts · [[map-view-state-management]] [[ssr-hydration-strategy]] [[url-query-parameter-persistence]]

- useMapViewState · function · L16-L18 — Returns the current map viewport state (longitude, latitude, zoom) from Jotai atoms.
- useMapViewStateUrlSync · function · L23-L37 — Syncs initial map viewport from URL query parameters (longitude, latitude, zoom) on component mount.
- useUpdateViewStateUrlParams · function · L44-L66 — Debounces and synchronizes the current viewport state back to the URL query parameters when the workspace is ready.
- getMapViewport · function · L78-L86 — Extracts the WebMercator viewport from a Deck.gl map instance by finding the viewport with the map view ID.
- useMapViewport · function · L88-L91 — Returns the current WebMercator viewport from the active Deck.gl map context.
