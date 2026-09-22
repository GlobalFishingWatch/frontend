# apps/platform/features/_map/map/popups/PopupWrapper.tsx · [[floating-ui-integration]] [[map-interaction-hooks]] [[map-popups-system]] [[popup-layout-components]]

A React component that renders a floating popup anchored to map coordinates with configurable positioning, arrow, and close button using floating-ui middleware.

- getBoundary · function · L26-L26 — Retrieves the map container DOM element to constrain popup positioning and boundary calculations.
- OFF_MAP_RECT · function · L27-L27 — Returns a DOMRect positioned far off-screen to hide the popup when coordinates are invalid.
- PopupWrapperProps · type · L29-L38 — Defines the shape of props accepted by the PopupWrapper component, including position, visibility controls, and callbacks.
- PopupWrapper · function · L40-L142 — React component that positions and renders a floating popup at map coordinates with automatic boundary handling and user interaction controls.
- apply · method · L90-L92 — Middleware callback that sets CSS custom property for the maximum available height within popup boundaries.
