# libs/timebar/src/timebar-range.ts · [[time-range-state-management]] [[time-representation-conventions]] [[time-snapping-boundary-logic]]

Module providing React hook utilities for managing and validating timebar range state with automatic clamping to min/max bounds.

- Range · type · L7-L7 — Data structure representing a time range with ISO string start and end boundaries.
- clampToMinAndMax · function · L13-L37 — Constrains a time range to fall within minimum and maximum millisecond bounds, clamping to either end as needed.
- UseTimebarRangeParams · type · L39-L45 — Configuration object defining inputs required by the useTimebarRange hook.
- useTimebarRange · function · L47-L91 — React hook that synchronizes timebar range state with external prop changes while deduplicating echo feedback from emitted changes.
