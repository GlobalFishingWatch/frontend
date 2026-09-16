# libs/deck-layers/src/layers/vessel/VesselEventsLayer.ts · [[color-and-configuration-management]] [[deck-gl-layer-foundation]] [[shared-picking-and-layer-utilities]] [[vessel-layer-system]]

Defines a composite deck.gl layer that renders vessel event markers and paths, with color and filtering logic based on event type, longline categories, and highlight state.

- _VesselEventsLayerProps · type · L23-L37 — Defines the configuration properties for the VesselEventsLayer, including event type, time ranges, highlight filters, and visual styling.
- VesselEventsLayer · class · L39-L160 — A deck.gl composite layer that renders fishing and gap event points and paths for a vessel, with dynamic coloring and filtering based on time and selection state.
- renderLayers · method · L42-L159 — Constructs and returns the icon and path sublayers for rendering vessel events, applying time filtering, color-coding logic, and conditional gap visualizations.
- getFillColor · function · L45-L54 — Determines the fill color for an event based on highlight status, event type, and longline category.
