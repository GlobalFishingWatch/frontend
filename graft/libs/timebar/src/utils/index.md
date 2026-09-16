# libs/timebar/src/utils/index.ts · [[timebar-utilities-helpers]]

- useLatest · function · L9-L15 — React hook that maintains a mutable reference to the latest value, useful for capturing current state in callbacks without causing re-renders.
- getTime · function · L17-L17 — Converts an ISO date string to UTC millisecond timestamp for time arithmetic.
- getDeltaMs · function · L19-L19 — Calculates the millisecond difference between two ISO date strings.
- getDeltaDays · function · L20-L21 — Converts millisecond delta between two ISO dates into fractional days.
- isMoreThanADay · function · L22-L22 — Determines whether the span between two dates exceeds one full day.
- getDefaultFormat · function · L23-L24 — Selects the appropriate date format string based on whether the time span is greater than one day.
- YearBoundsOptions · type · L26-L29 — Type definition for optional absolute start and end date strings used to constrain year boundaries.
- isYearInBounds · function · L31-L36 — Validates whether a given year falls within the configured or default bounds (absolute start/end dates).
- getHumanizedDates · function · L38-L46 — Formats start and end ISO dates into locale-specific human-readable strings and calculates the interval in days.
- getLastX · function · L48-L57 — Computes a date range ending at the latest available data date and extending back by a specified number of time units.
- stickToClosestUnit · function · L58-L66 — Rounds a date to the nearest boundary (start or end) of the specified time unit.
- clampToAbsoluteBoundaries · function · L68-L95 — Constrains a date range within absolute boundaries while preserving the requested duration when possible.
