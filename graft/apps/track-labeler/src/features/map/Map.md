# apps/track-labeler/src/features/map/Map.tsx · [[map-rendering-visualization-layer]] [[throttled-state-updates-for-ui-responsiveness]]

Main module exporting the interactive map visualization component for track labeling with deck.gl rendering, legend controls, and view state management.

- MapComponent · function · L40-L184 — React component that renders an interactive deck.gl map with track points, handles view state changes, displays a clickable legend for filtering labels, and manages map bounds for miniglobe synchronization.
- handleLegendClick · function · L84-L86 — Dispatcher function that toggles visibility of track labels when a legend item is clicked.
- updateBounds · function · L100-L125 — Calculates and updates the geographic bounds of the current map viewport from deck.gl viewports and converts them into miniglobe-compatible north/south/east/west coordinates.
