# libs/data-transforms/src/list-to-track-segments/check-record-validity.ts · [[coordinate-validation-and-normalization]] [[track-segment-processing-pipeline]]

Module that validates geographic coordinate and timestamp fields in data records for track segment processing.

- Args · type · L5-L7 — Type that combines segment column mappings with a raw data record for validation.
- RecordValidationErrors · type · L9-L9 — Union type enumerating the possible validation error categories for geographic and temporal data.
- checkRecordValidity · function · L11-L36 — Validates that a record contains parseable latitude (±90°), longitude (±180°), and optional valid timestamps, returning error field names.
