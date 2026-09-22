# libs/deck-layer-composer/src/types/dataviews.ts · [[api-type-system]] [[deck-layer-composition-system]]

Type definitions module for dataview configurations and resolved dataview instances used by the deck layer composer.

- FourwingsSublayerConfig · type · L9-L24 — Defines the configuration schema for a Fourwings sublayer, specifying datasets, visibility, styling, filtering, and vessel group properties.
- ResolvedFourwingsDataviewInstance · type · L26-L31 — Represents a resolved Fourwings dataview instance with merged sublayer configurations for Activity or Detections layers.
- ResolvedContextDataviewInstance · type · L33-L39 — Represents a resolved context dataview instance with layers containing resolved context sublayer configurations.
- ResolvedDataviewInstance · type · L41-L42 — Union type that encompasses all possible resolved dataview instance variants: generic, Fourwings, or context-based.
