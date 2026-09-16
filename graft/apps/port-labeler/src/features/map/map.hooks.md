# apps/port-labeler/src/features/map/map.hooks.ts · [[interactive-map-rendering-viewport-state]] [[interactive-selection-table-synchronization]] [[port-labeler-map-system]]

- BoxSelection · interface · L20-L25 — Data structure representing the start and end positions and coordinates of a user-drawn selection box on the map.
- UseSelector · type · L27-L37 — Return type for useSelectorConnect hook providing selection box state and mouse/hover event handlers for map point selection.
- useSelectorConnect · function · L40-L201 — Hook managing point selection on map via shift-click box drag, single click toggle, and hover highlight state with feature state updates.
- UseMap · type · L203-L205 — Return type for useMapConnect hook providing a method to center the map viewport on a set of port positions.
- useMapConnect · function · L207-L243 — Hook that centers the map viewport on port locations by computing a bounding box and fitting the bounds with padding.
