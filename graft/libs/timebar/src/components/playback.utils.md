# libs/timebar/src/components/playback.utils.ts · [[playback-control-system]] [[time-representation-conventions]] [[time-snapping-boundary-logic]]

- GetStepProps · type · L18-L28 — Configuration object type for step-calculation parameters including time range, multiplier, and interval mode selection.
- getStep · function · L30-L38 — Converts a fractional speed step into milliseconds by scaling linearly across the start-to-end time range.
- isUnparseableRange · function · L40-L41 — Validates that both start and end date strings parse to valid numeric timestamps.
- toISOStringIfValid · function · L43-L46 — Safely converts a millisecond timestamp to ISO string format, returning undefined if the date is invalid.
- getTimebarStepByDelta · function · L48-L117 — Advances or reverses a time range by a delta amount based on interval units or linear speed, then clamps the result to absolute boundaries.
