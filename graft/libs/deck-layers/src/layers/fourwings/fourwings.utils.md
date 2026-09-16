# libs/deck-layers/src/layers/fourwings/fourwings.utils.ts · [[fourwings-data-infrastructure]]

Utility module providing functions to compute time intervals, chunk boundaries, and buffers for Fourwings data layer time-series fetching.

- getDateInIntervalResolution · function · L11-L16 — Converts a timestamp to the start of the specified Fourwings interval unit (day, month, etc.) in UTC.
- GetChunkByIntervalParams · type · L18-L26 — Defines the configuration parameters for computing a Fourwings data chunk by time interval.
- getChunkByInterval · function · L28-L69 — Computes a Fourwings chunk with buffered time boundaries, accounting for interval type and cache mode.
- getChunkBuffer · function · L71-L77 — Calculates the buffer duration in milliseconds for a given Fourwings interval.
