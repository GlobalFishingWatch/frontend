# libs/deck-layers/src/layers/labels/LabelLayer.ts · [[asynchronous-font-loading]] [[deck-gl-composite-layer-pattern]] [[labels-layer]]

- LabelLayerState · type · L16-L18 — Type definition tracking whether the deck font has been loaded asynchronously.
- PaddedCharactersLayer · class · L24-L42 — Custom icon layer that pads character glyphs in the font atlas to prevent edge-bleed artifacts.
- getShaders · method · L27-L41 — Patches the vertex shader to apply padding offsets around each character's font atlas frame.
- LabelLayerProps · type · L44-L51 — Configuration type extending TextLayer props with label-specific callbacks and filtering options.
- LabelLayer · class · L53-L108 — Composite layer rendering GeoJSON point features as text labels with font management and collision handling.
- initializeState · method · L80-L90 — Initializes layer state and asynchronously loads the custom deck font for label rendering.
- renderLayers · method · L92-L107 — Returns an array containing a TextLayer sublayer only after the font has loaded successfully.
