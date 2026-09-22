# apps/platform/queries/map/stats-api.ts · [[gfw-base-query]] [[statistics-apis]]

- FetchDataviewStatsParams · type · L22-L26 — Parameters required to fetch statistics for a dataview, including time range, dataview configuration, and optional stat field selection.
- CustomBaseQueryArg · interface · L28-L31 — Extended fetch query argument interface that adds dataview and timerange context to Redux Toolkit's base query arguments.
- serializeStatsDataviewKey · function · L33-L39 — Serializes query cache keys by combining dataview ID, config, and timerange into a deterministic string to enable proper query memoization.
