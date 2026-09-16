# libs/deck-loaders/src/vessels/lib/parse-events.spec.ts · [[event-type-specific-color-styling]] [[vessel-events-parsing-pipeline]]

Test suite for the parseEvents function that validates event parsing from binary buffers into deck layer format with coordinate conversion, timestamp parsing, and event-type-specific color assignment.

- toArrayBuffer · function · L5-L8 — Converts a JSON string to an ArrayBuffer for use as test input data.
- longlineSet · function · L92-L98 — Factory function that creates a fishing event with optional day/night categorization for testing type-dependent color assignment logic.
