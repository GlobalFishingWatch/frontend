# apps/port-labeler/src/features/map/Map.tsx · [[authentication-api-token-management]] [[interactive-map-rendering-viewport-state]] [[interactive-selection-table-synchronization]] [[port-data-metadata-types]]

Map component that renders an interactive MapLibre map display with port labeling controls and area/point layers for the Global Fishing Watch application.

- transformRequest · function · L25-L36 — Adds GFW API authorization headers to tile requests from globalfishingwatch domain.
- handleError · function · L38-L42 — Handles 401 authentication errors from globalfishingwatch API by refreshing the API token.
- MapWrapper · function · L44-L104 — Renders the main map component with viewport controls, layer management, and mouse interaction handlers for box selection.
