# libs/deck-layer-composer/src/resolvers/resolvers.spec.ts · [[jotai-store-isolation-in-tests]] [[test-fixtures-and-factories]]

Test suite for the resolvers module, validating deck layer generation from dataview configurations across multiple layer types and error scenarios.

- createMockDataview · function · L49-L63 — Factory function that creates a mock ResolvedDataviewInstance with sensible defaults for testing dataview-to-deck-layer resolution.
- createMockGlobalConfig · function · L65-L79 — Factory function that produces a mock ResolverGlobalConfig with standard temporal bounds and visualization mode defaults for resolver tests.
- createMockDataset · function · L81-L105 — Factory function that generates a mock Dataset with complete metadata and configuration, supporting PMTiles and UserContext dataset types.
- createMockUserDataview · function · L109-L141 — Factory function that constructs a mock user-category dataview with UserContext dataset, context layers, and sublayer configuration for user data tests.
