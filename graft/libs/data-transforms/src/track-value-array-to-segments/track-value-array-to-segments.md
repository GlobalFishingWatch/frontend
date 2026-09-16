# libs/data-transforms/src/track-value-array-to-segments/track-value-array-to-segments.ts · [[track-value-array-deserialization]]

Module that exports utilities for converting compressed track value arrays into segments of track points with decoded coordinate and temporal data.

- trackValueArrayToSegments · function · L31-L115 — Deserializes a flat Int32 array into nested TrackSegment arrays by decoding field values, splitting segments at designated indices, and applying field-specific precision transformers.
