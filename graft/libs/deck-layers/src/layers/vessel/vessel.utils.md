# libs/deck-layers/src/layers/vessel/vessel.utils.ts · [[data-transformation-pipeline]] [[spatial-indexing-and-geometry]] [[temporal-filtering-architecture]] [[vessel-layer-system]]

- memoize · function · L20-L32 — Generic memoization decorator that caches function results based on a custom resolver key.
- getVesselResourceChunks · function · L36-L64 — Splits a time range into yearly chunks with month-based buffering to optimize vessel data loading.
- GetSegmentsFromDataParams · type · L66-L72 — Configuration object for segment extraction from vessel track data with optional filters and coordinate inclusion.
- getPointByIndex · function · L114-L126 — Extracts coordinate, timestamp, speed, and elevation data for a single track point by index.
- isGapAfter · function · L130-L135 — Detects whether the gap to the next track point exceeds the configured threshold.
- isTimestampInRange · function · L137-L141 — Checks if a timestamp falls within the optional start and end time filter bounds.
- flushCurrent · function · L170-L178 — Converts accumulated point indices into a track segment, filtering to endpoints unless middle points are requested.
- generateVesselGraphStepValues · function · L234-L238 — Creates an array of scaled numeric thresholds spanning the graph color steps based on data extent.
- generateVesselGraphSteps · function · L240-L251 — Generates color-mapped visualization steps for vessel speed or elevation, with direction-aware color indexing.
