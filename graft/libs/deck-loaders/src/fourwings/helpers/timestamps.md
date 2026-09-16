# libs/deck-loaders/src/fourwings/helpers/timestamps.ts · [[fourwings-aggregation-migration]] [[timestamp-frame-index-utilities]]

- getFourwingsSublayerStartFrame · function · L6-L12 — Computes the absolute interval frame offset for a specific sublayer by combining tile start frame and per-sublayer start offsets.
- getFourwingsValueTimestamp · function · L14-L23 — Converts a frame index (derived from tile start, offset, and value index) into an absolute timestamp using interval-specific configuration.
- findFourwingsValueIndexByTimestamp · function · L25-L46 — Searches for the value index whose computed timestamp matches the target timestamp within a given value range.
- FourwingsDateBucket · type · L48-L48 — Type alias defining a date bucket as a numeric record with optional count array for aggregating sublayer values by timestamp.
- accumulateSublayerValuesByFrame · function · L50-L88 — Aggregates sublayer values into date buckets by timestamp, applying optional value range filters to include only values within visibility bounds.
- accumulateFourwingsSublayerByFrame · function · L90-L127 — Wraps accumulateSublayerValuesByFrame by computing the correct tile start frame and sublayer offset from feature properties and chunk metadata.
