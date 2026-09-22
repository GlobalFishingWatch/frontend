# libs/deck-layers/src/layers/fourwings/positions/FourwingsPositionsTileLayer.spec.ts · [[fourwings-positions-layer]] [[viewport-deduplication]]

Test suite for FourwingsPositionsTileLayer that verifies state rebuild logic and viewport loading behavior.

- makeLayer · function · L25-L42 — Factory function that creates a FourwingsPositionsTileLayer instance with minimal mock state and context for testing.
- position · function · L44-L47 — Helper that constructs a GeoJSON position feature with vessel identity and timestamp properties.
- makeTile · function · L49-L52 — Helper that creates a mock tile object with content and a normalized bounding box for testing.
