# apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx · [[deckgl-layer-integration]] [[events-layer-management]]

React component that renders an interactive panel for configuring and controlling events layer visibility, filters, color properties, and migration status on the map.

- EventsLayerPanelProps · type · L39-L42 — Type definition specifying the props interface for the EventsLayerPanel component.
- EventsLayerPanel · function · L44-L243 — Main React component that renders an expandable events layer panel with toggle controls, color properties, filters, and migration warnings for deprecated dataviews.
- closeExpandedContainer · function · L79-L82 — Helper function that closes all open expanded containers (filters and color picker) to collapse the panel details.
- onToggleFilterOpen · function · L84-L86 — Event handler that toggles the filter panel open/closed state.
- changeColor · function · L88-L97 — Event handler that updates the dataview instance with a new color scheme and closes the color picker.
- onToggleColorOpen · function · L99-L101 — Event handler that toggles the color picker panel open/closed state.
