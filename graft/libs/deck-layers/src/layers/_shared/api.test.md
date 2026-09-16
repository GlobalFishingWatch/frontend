# libs/deck-layers/src/layers/_shared/api.test.ts · [[api-integration-and-data-loading]]

Test suite verifying that fetchWithGFWAPI correctly extracts and passes the timestamp-base header to track loaders, and handles missing headers appropriately.

- trackResponse · function · L25-L29 — Factory function that constructs a mock Response object with optional timestamp-base header for testing track fetch scenarios.
