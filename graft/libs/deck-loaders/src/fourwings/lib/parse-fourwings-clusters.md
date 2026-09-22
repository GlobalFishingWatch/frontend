# libs/deck-loaders/src/fourwings/lib/parse-fourwings-clusters.ts · [[fourwings-cluster-loader]]

Module that parses Fourwings cluster data from binary buffers and converts it to GeoJSON point features with temporal and spatial attributes.

- getPointsTemporalAggregated · function · L32-L95 — Converts raw integer array data into point features with temporally aggregated values by mapping cell numbers and their aggregate values to geographic coordinates.
- getPoints · function · L97-L175 — Transforms raw integer array data into point features with individual timestamped values, filtering out no-data entries and associating each value with its temporal frame.
- readData · function · L177-L179 — Utility callback that extracts packed variant-encoded data from a PBF buffer and appends it to an array.
- parseFourwingsClusters · function · L181-L189 — Entry point that decodes a PBF-encoded buffer and routes it to either temporal aggregation or per-value parsing based on configuration.
