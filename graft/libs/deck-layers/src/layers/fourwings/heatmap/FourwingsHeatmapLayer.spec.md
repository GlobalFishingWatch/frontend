# libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapLayer.spec.ts · [[comparison-mode-rendering]] [[fourwings-heatmap-layer]]

Test suite for the FourwingsHeatmapLayer component, verifying color computation methods, picking behavior, and layer rendering across compare, time-compare, and bivariate modes.

- colorObj · function · L12-L12 — Helper that converts a numeric value to an RGBA color object for test scale creation.
- makeLayer · function · L35-L41 — Factory function that instantiates a FourwingsHeatmapLayer with test defaults and configurable property overrides.
- feature · function · L43-L50 — Factory that creates mock feature objects with aggregated values and metadata for layer color computation tests.
