# libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsIconLayer.ts · [[fourwings-positions-layer]] [[shader-based-time-range-highlighting]]

Module providing an IconLayer subclass that highlights vessel positions by time range while dimming non-highlighted positions.

- _FourwingsPositionsIconLayerProps · type · L5-L24 — Type definition for custom layer props controlling vessel highlighting by feature and time range with dimming opacity.
- FourwingsPositionsIconLayerProps · type · L26-L27 — Composite type combining IconLayer base props with custom highlighting props.
- FourwingsPositionsIconLayer · class · L60-L118 — Custom deck.gl IconLayer that fades non-highlighted vessel positions and highlights positions within a specified time range.
- initializeState · method · L67-L73 — Registers GPU instance attributes for per-position highlight status and relative timestamp data.
- getShaders · method · L75-L104 — Injects GLSL shader code to pass highlight and timestamp attributes to fragment shader and apply time-range-based highlighting with dimming.
- draw · method · L106-L117 — Updates shader uniforms with current highlight time range and opacity before rendering.
