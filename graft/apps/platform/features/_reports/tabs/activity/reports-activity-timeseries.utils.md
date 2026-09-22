# apps/platform/features/_reports/tabs/activity/reports-activity-timeseries.utils.ts · [[internationalization-i18n-and-formatting]] [[overlapping-geometry-aggregation]] [[time-series-data-transformation]]

Utility module for converting Fourwings heatmap features to timeseries graph data and computing aggregate statistics for activity reports.

- FourwingsFeaturesToTimeseriesParams · type · L32-L41 — Parameter type defining temporal bounds, aggregation mode, and spatial filtering configuration for Fourwings feature-to-timeseries conversion.
- fourwingsFeaturesToTimeseries · function · L42-L138 — Converts filtered Fourwings polygon features into evolution timeseries data by aggregating cell values separately for contained and overlapping geometries.
- GetFourwingsTimeseriesParams · type · L140-L143 — Parameter type encapsulating filtered polygon features and their parent Fourwings deck layer instance for timeseries extraction.
- getFourwingsTimeseries · function · L144-L168 — Extracts timeseries graph data from a Fourwings deck layer by assembling aggregation parameters and delegating to fourwingsFeaturesToTimeseries.
- getFourwingsTimeseriesStats · function · L170-L236 — Computes min, max, and mean statistics from Fourwings cell values within a time range, applying visibility filters and handling both static and temporal aggregation.
- formatDateTicks · function · L238-L241 — Formats a date tick string for axis display using locale-aware formatting tailored to the Fourwings time chunk interval.
- formatEvolutionData · function · L243-L353 — Transforms raw timeseries data into chart-ready format by filling interval gaps, computing min/max ranges, and optionally merging comparison period values.
- processTimeseries · function · L296-L302 — Converts evolution graph data with min/max values into range and average tuples for chart rendering.
