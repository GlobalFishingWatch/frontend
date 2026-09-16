# apps/platform/features/_map/map/map-bounds.hooks.ts · [[map-viewport-management]]

- useMapBounds · function · L18-L37 — Computes and persists map bounds to shared state by unprojecting viewport corners after debouncing viewport changes.
- useMapBoundsLive · function · L39-L47 — Returns the current map bounds calculated from the live viewport without persisting to state.
- FitBoundsParams · type · L49-L57 — Configuration options for fitting the map view to bounds, including map dimensions, zoom constraints, padding, and animation preferences.
- getMapCoordinatesFromBounds · function · L59-L80 — Calculates viewport latitude, longitude, and zoom level to fit a geographic bounding box within map dimensions, accounting for UI elements and normalizing longitude to ±180 range.
- useMapFitBounds · function · L87-L117 — Returns a callback that animates the map viewport to fit specified bounds, with optional zoom constraints and fly-to animation, managing transition state.
