# libs/deck-loaders/src/fourwings/lib/fourwings-test-fixtures.ts · [[test-fixture-factories]]

Test fixture utilities for generating mock tile bounding boxes and Protocol Buffer buffers for heatmap and vector data in the Fourwings deck loader.

- createMockTileBBox · function · L3-L12 — Creates a mock tile bounding box object with global extent coordinates and zero-indexed tile position for testing.
- createHeatmapPbfBuffer · function · L14-L23 — Encodes heatmap cell data (cellNum, frame range, and values) into a Protocol Buffer binary format with packed varints.
- createAggregatedHeatmapPbfBuffer · function · L26-L34 — Encodes temporally aggregated heatmap data (single cellNum-value pairs) into a Protocol Buffer binary format.
- createVectorsPbfBuffer · function · L36-L63 — Encodes vector (u, v component) cell data into Protocol Buffer format, switching between aggregated and framed temporal modes.
