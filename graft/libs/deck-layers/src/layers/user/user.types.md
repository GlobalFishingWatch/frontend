# libs/deck-layers/src/layers/user/user.types.ts · [[user-layer-system]]

Defines type system for user layer configurations and interactions in deck.gl, including filter extensions, layer property schemas, and picking object structures.

- FilterExtensionProps · type · L11-L15 — Defines the configuration shape for data filtering extension props used in deck.gl layers.
- BaseUserLayerProps · type · L17-L31 — Base properties for user-generated layers including layer configuration, timing, and time-filtering behavior.
- UserPolygonsLayerProps · type · L33-L45 — Configuration for polygon-rendering user layers with color ramp and value picking support.
- UserPointsLayerProps · type · L47-L71 — Configuration for point-rendering user layers with dynamic circle sizing and radius interpolation.
- UserTrackLayerProps · type · L73-L86 — Configuration for track-rendering user layers with temporal highlighting and pick-target width control.
- AnyUserLayerProps · type · L88-L88 — Union type covering all possible user layer property configurations.
- UserLayerFeature · type · L90-L90 — Type alias for GeoJSON features with arbitrary properties used in user layers.
- UserLayerPickingObject · type · L92-L94 — Picking interaction object type combining user layer features with context layer base properties.
- UserLayerPickingInfo · type · L96-L96 — Picking event metadata type for user layers including tile header context.
