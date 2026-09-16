# libs/deck-layers/src/types.ts · [[interactive-picking-and-enrichment]] [[type-system-and-layer-contracts]]

Type definitions for deck.gl layer configuration, picking objects, and layer categorization.

- DeckLayerCategory · type · L33-L33 — Enumerates the valid categories for deck.gl layers, extending API dataview categories with rulers and draw layers.
- DeckLayerSubcategory · type · L34-L34 — Specifies subcategory types for deck layers, combining API dataview types with draw-specific subcategories.
- DeckLayerProps · type · L36-L40 — Generic type that enforces required id and category fields along with optional subcategory for all deck layer properties.
- DeckPickingObject · type · L42-L52 — Generic type that standardizes picking interaction data across layers with metadata like title, count, color, and interaction flags.
- AnyDeckLayer · type · L54-L62 — Union type covering all supported deck.gl layer implementations used in the application.
- LayerWithIndependentSublayersLoadState · type · L64-L64 — Identifies VesselLayer as the only layer type with independent sublayer loading state management.
- DeckLayerPickingObject · type · L66-L78 — Union of all possible picking object types returned during layer interaction, enabling type-safe picking handlers.
- DeckLayerInteractionPickingInfo · type · L80-L87 — Union of picking info objects paired with their corresponding layer type to enable layer-specific interaction handling.
