# apps/port-labeler/src/utils/dates.ts · [[utility-helpers-type-safety]]

Utility module providing date and time manipulation functions using Luxon library for UTC timezone handling and time range duration calculations.

- getUTCDateTime · function · L4-L7 — Converts a string (ISO format) or milliseconds timestamp into a UTC DateTime object.
- getTimeRangeDuration · function · L9-L18 — Calculates the duration between two timestamps in a specified unit, returning the difference in a given time interval (default years).
