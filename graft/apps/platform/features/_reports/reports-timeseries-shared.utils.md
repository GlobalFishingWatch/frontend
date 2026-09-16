# apps/platform/features/_reports/reports-timeseries-shared.utils.ts · [[report-timeseries-pipeline]]

Utility module for converting frame-based timeseries data to date-based timeseries and retrieving type-safe statistics from different report graph types.

- TimeSeriesFrame · interface · L10-L16 — Data structure representing a single frame in a timeseries with numeric values keyed by sublayer index.
- TimeSeries · type · L18-L22 — Type definition aggregating frame-based timeseries data with minimum and maximum frame boundaries.
- frameTimeseriesToDateTimeseries · function · L24-L37 — Converts frame-indexed timeseries data into date-based timeseries by extracting the date field and normalizing frame values.
- getStatsValue · function · L39-L59 — Type-safe accessor that retrieves a property from different report statistics types by narrowing the union type based on the stats object's type discriminator.
