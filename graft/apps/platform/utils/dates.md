# apps/platform/utils/dates.ts · [[date-and-time-utilities]]

- getFlooredMinute · function · L13-L19 — Calculates the floored minute boundary aligned to the real-time data update interval.
- getRealTimeLatestAvailableDataDate · function · L21-L26 — Returns the most recent ISO timestamp aligned to the real-time data update interval.
- getMsUntilNextRealTimeUpdate · function · L28-L36 — Calculates milliseconds remaining until the next real-time data update boundary.
- UserCreatedEntities · type · L38-L38 — Type alias defining entities that have creation timestamps (Dataset, AppWorkspace, VesselGroup, Report).
- sortByCreationDate · function · L40-L45 — Sorts user-created entities in descending order by their creation timestamp.
- getTimeAgo · function · L49-L61 — Converts a date into a human-readable relative time string (e.g., '2 days ago') using i18n translation.
- getDateLabel · function · L63-L67 — Formats a timestamp as a full locale-specific date with a relative time qualifier appended.
- isTimestampNumber · function · L69-L72 — Validates whether a number is a plausible Unix millisecond timestamp within the range 2000–3000.
- pickDateFormatByPrecision · function · L76-L78 — Selects a date format (day-level or second-level precision) based on whether the timestamp aligns to a full day boundary.
- pickDateFormatByRange · function · L80-L84 — Selects a date format based on whether the time range spans within an hourly interval or longer.
