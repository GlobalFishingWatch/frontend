# libs/data-transforms/src/dates/dates.ts · [[temporal-data-handling]]

Module for parsing and formatting dates in UTC with support for multiple date/time formats and interval-based bucketing.

- DateTimeParseFunction · type · L8-L8 — Type definition for a function that parses a timestamp string into a Luxon DateTime object with optional DateTimeOptions.
- makeFormatParsers · function · L24-L30 — Factory function that generates an array of date/time parser functions by combining date and time format patterns.
- detectCandidates · function · L47-L53 — Identifies the most likely date format candidates for a given string by regex pattern matching.
- getUTCDate · function · L55-L80 — Parses a timestamp string or number into a JavaScript Date object in UTC, with fallback to invalid date on parse failure.
- SupportedDateType · type · L81-L81 — Type alias for date inputs that can be processed by date conversion functions: string, number (milliseconds), or native Date.
- getUTCDateTime · function · L82-L129 — Converts a supported date type into a Luxon DateTime object in UTC, with exhaustive format detection and error recovery.
- getISODateByInterval · function · L131-L151 — Formats a date as an ISO string bucketed by a fourwings interval granularity (year, month, day, or hour).
- formatDateForInterval · function · L153-L177 — Renders a date as a human-readable localized string formatted according to the fourwings time chunk interval.
- StickToClosestIntervalParams · type · L179-L182 — Type for parameters specifying start and end date strings that define a date range for interval snapping.
- stickToClosestInterval · function · L183-L201 — Snaps start and end dates to the nearest boundary of their detected interval unit, ensuring the range spans at least one full interval.
- getClosestIntervalDate · function · L185-L192 — Determines whether a given date is closer to the start or end of its interval period and returns the nearest boundary.
