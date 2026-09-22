# libs/deck-layers/src/layers/vessel/VesselPositionLayer.ts · [[color-and-configuration-management]] [[deck-gl-layer-foundation]] [[multi-mode-visualization]] [[shared-picking-and-layer-utilities]] [[vessel-layer-system]]

Defines a composite layer component that renders vessel position indicators as either icons or scatter plot points on a map display.

- VesselTrackPositionFeature · type · L15-L25 — GeoJSON Feature type representing a vessel position point with course, speed, depth, and timestamp properties.
- VesselPositionMode · type · L26-L26 — Union type specifying whether vessel positions render as icons or points.
- _VesselTrackPositionLayerProps · type · L28-L38 — Configuration object type for vessel position layer including visibility, rendering mode, styling, and data accessor.
- VesselTrackPositionLayerProps · type · L39-L39 — Extended props type combining internal vessel layer configuration with standard Deck.gl layer properties.
- VesselTrackPositionLayer · class · L41-L143 — Composite Deck.gl layer that renders vessel positions as either animated sprite icons with optional highlights or simple scatter points.
- renderLayers · method · L46-L142 — Generates icon or point sublayers based on position mode, conditionally applying borders and labels based on highlight timing.
