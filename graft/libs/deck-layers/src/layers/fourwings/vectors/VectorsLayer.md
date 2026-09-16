# libs/deck-layers/src/layers/fourwings/vectors/VectorsLayer.ts · [[fourwings-vectors-layer]]

Module that exports a custom deck.gl vector visualization layer for rendering directional velocity arrows.

- _VectorsLayerProps · type · L6-L11 — Type definition for internal vector layer property configuration including data source, velocity, direction, and maximum velocity threshold.
- VectorsLayerProps · type · L13-L14 — Exported type combining vector-specific properties with standard scatterplot layer properties for public API.
- VectorsLayer · class · L38-L188 — Custom deck.gl layer that renders vector arrows with directional rotation and velocity-based scaling and opacity.
- _getModel · method · L45-L76 — Creates a GPU model with arrow-shaped geometry (two triangles forming an arrowhead) for instanced rendering.
- initializeState · method · L78-L99 — Registers GPU shader attributes for per-instance direction and velocity data to drive vector transformations.
- getShaders · method · L101-L173 — Injects GLSL shader code to rotate, scale, and color-adjust arrow triangles based on normalized velocity and direction angle.
- draw · method · L175-L187 — Passes the maximum velocity uniform to the GPU and delegates rendering to the parent scatterplot layer.
