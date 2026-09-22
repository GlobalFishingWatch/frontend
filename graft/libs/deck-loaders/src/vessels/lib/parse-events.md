# libs/deck-loaders/src/vessels/lib/parse-events.ts · [[event-type-specific-color-styling]] [[vessel-events-parsing-pipeline]]

Module that transforms raw API event buffers into deck layer event data with color coding and standardized coordinate/timestamp formats.

- decodeEventsBuffer · function · L13-L16 — Decodes an ArrayBuffer containing JSON-encoded event data and extracts the entries array.
- parseEvents · function · L18-L35 — Transforms raw API events into vessel deck layer events by converting coordinates to [lon, lat] format, parsing ISO timestamps to milliseconds, and assigning colors based on event type.
