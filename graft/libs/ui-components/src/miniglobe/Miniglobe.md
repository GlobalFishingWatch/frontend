# libs/ui-components/src/miniglobe/Miniglobe.tsx · [[d3-scale-geojson-integration]] [[map-globe-visualization]] [[viewport-bounds-edge-densification-pattern]]

- MiniglobeBounds · interface · L10-L15 — Interface defining the geographic bounding box coordinates (north, south, west, east) to highlight on the globe.
- MiniglobeCenter · interface · L17-L20 — Interface specifying the central latitude and longitude for the globe's projection orientation.
- densifyEdge · function · L23-L27 — Interpolates intermediate points between two geographic coordinates to create smooth curved edges on the globe.
- MiniglobeProps · interface · L37-L43 — Interface defining the component props: center position, optional bounds, size, styling, and viewport thickness.
- MiniGlobe · function · L45-L136 — React component that renders an interactive orthographic miniglobe with world land features and an optional geographic bounds indicator.
