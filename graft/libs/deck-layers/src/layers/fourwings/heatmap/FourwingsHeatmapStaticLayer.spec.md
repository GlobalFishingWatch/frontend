# libs/deck-layers/src/layers/fourwings/heatmap/FourwingsHeatmapStaticLayer.spec.ts · [[fourwings-heatmap-layer]]

Test suite for FourwingsHeatmapStaticLayer verifying tile URL generation, cache key stability, color domain calculation, and cache hash behavior.

- colorObj · function · L6-L6 — Factory function that creates an RGB color object with alpha channel from a grayscale value.
- makeLayer · function · L24-L36 — Test helper that instantiates a FourwingsHeatmapStaticLayer with baseline properties and pre-initialized state for consistent test execution.
- staticFeature · function · L39-L47 — Test helper that constructs a mock 4wings feature object with cell coordinates and aggregated temporal values at a single frame.
