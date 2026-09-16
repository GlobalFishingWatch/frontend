# apps/port-labeler/src/features/map/map-viewport.hooks.ts · [[port-labeler-map-system]] [[viewport-state-atom]]

- ViewportKeys · type · L8-L8 — Union type that defines the valid keys for viewport property access.
- ViewportProps · type · L9-L9 — Record type that maps viewport keys to numeric values for map positioning.
- UseViewport · type · L10-L14 — Interface that defines the shape of the viewport hook's return value with state and handlers.
- getUrlViewstateNumericParam · function · L16-L20 — Extracts and parses a numeric viewport parameter from the URL query string with fallback handling.
- useViewport · function · L28-L43 — React hook that manages shared map viewport state and provides handlers for coordinate changes.
