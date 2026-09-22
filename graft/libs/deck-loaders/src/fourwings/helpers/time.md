# libs/deck-loaders/src/fourwings/helpers/time.ts · [[temporal-frame-conversion]]

Provides time interval utilities and conversion functions for the Fourwings data aggregation system.

- getFourwingsInterval · function · L32-L62 — Selects the appropriate time interval (HOUR, DAY, MONTH, YEAR) based on the time range duration and available options.
- getTimeRangeKey · function · L109-L111 — Generates a string key from start and end timestamps for caching or identifying time ranges.
