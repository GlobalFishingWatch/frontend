# libs/deck-layers/src/layers/fourwings/vectors/FourwingsVectorsLayer.ts · [[fourwings-vectors-layer]] [[per-sublayer-visibility-filtering]]

CompositeLayer that renders fourwings vector field data as directional arrows with velocity magnitude, handling temporal aggregation and interactive picking.

- FourwingsVectorsLayer · class · L34-L302 — CompositeLayer that renders Fourwings ocean current vectors as directional arrows with selectable time ranges and highlighting support.
- initializeState · method · L40-L44 — Initializes the layer's frame range state to zero on creation.
- renderLayers · method · L173-L297 — Constructs and returns the vector arrow layer, picking layer, highlighted layer, and optional debug tile border layers based on current time range and props.
- getData · method · L299-L301 — Returns the feature data array cast to the Fourwings feature type.
