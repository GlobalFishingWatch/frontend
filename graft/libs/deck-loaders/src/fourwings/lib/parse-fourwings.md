# libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts · [[fourwings-aggregation-migration]] [[fourwings-heatmap-loader]]

- isFourwingsNoDataValue · function · L15-L17 — Checks whether a varint value represents missing or invalid data.
- descaleFourwingsValue · function · L23-L29 — Converts a raw unsigned varint into its actual numeric value by applying scale and offset transformations.
- getCellTimeseries · function · L36-L178 — Decodes temporal timeseries data from a PBF stream, populating feature objects with multi-frame cell values and time-range aggregations.
- getCellTemporalAggregated · function · L184-L258 — Decodes temporally-aggregated PBF data where each cell holds a single aggregated value instead of a timeseries.
- parseFourwings · function · L260-L277 — Orchestrates PBF deserialization and routes to appropriate temporal decoder based on options, returning a final feature array.
