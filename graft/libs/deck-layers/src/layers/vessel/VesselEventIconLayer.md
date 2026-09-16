# libs/deck-layers/src/layers/vessel/VesselEventIconLayer.ts · [[color-and-configuration-management]] [[deck-gl-layer-foundation]] [[shader-based-filtering-and-highlighting]] [[vessel-layer-system]]

Layer component that renders vessel event icons with shape-based filtering, time-range highlighting, and custom shader-based rendering for fishing-event visualization.

- _VesselEventIconLayerProps · type · L10-L26 — Type alias defining custom properties for vessel event icon rendering, including event metadata, time ranges, accessors, and callbacks.
- VesselEventIconLayerProps · type · L28-L29 — Type alias composing custom event icon properties with deck.gl's ScatterplotLayerProps to form the complete props interface.
- VesselEventIconLayer · class · L73-L200 — Subclass of ScatterplotLayer that renders maritime event icons with shape variants, time-based highlighting via uniforms, and custom fragment shaders.
- initializeState · method · L80-L105 — Registers GPU instanced attributes for event shapes and start/end times to support per-instance rendering and shader access.
- getShaders · method · L107-L176 — Injects custom vertex and fragment shaders to render event icons with shape-specific geometry clipping and time-range-based highlight positioning.
- draw · method · L186-L199 — Passes highlight time range uniforms to the shader model before rendering to enable time-based event filtering on the GPU.
