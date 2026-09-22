# libs/deck-layers/src/config/colorRamps.config.ts · [[color-ramp-configuration]] [[layer-type-and-configuration-system]]

Configuration module that defines color ramp constants, types, and color mappings for heatmap visualization layers.

- ColorRampId · type · L6-L16 — Enumeration of available standard color ramp identifiers used for single-hue heatmap rendering.
- ColorRampWhiteId · type · L18-L28 — Enumeration of color ramp identifiers that fade to white, providing an alternative rendering style for heatmaps.
- ColorRampsIds · type · L30-L30 — Union type that combines standard and white-fading color ramp identifiers into a single acceptable ramp ID type.
- MultiHueColorRampId · type · L56-L56 — Type that derives valid multi-hue color ramp identifiers from the MULTI_HUE_COLOR_RAMPS mapping keys.
- AnyColorRampId · type · L57-L57 — Union type that accepts either standard or multi-hue color ramp identifiers for flexible ramp selection.
