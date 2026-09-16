# apps/data-download-portal/src/utils/dates.ts · [[data-download-portal-utilities]] [[defensive-utility-design-with-lenient-error-handling]]

Utility module that provides functions to safely convert various date formats to UTC DateTime objects and format them as locale strings.

- DateInput · type · L3-L3 — Type alias that accepts multiple date input formats for flexible date parameter handling.
- getUTCDateTime · function · L5-L25 — Converts various date input formats into a UTC DateTime object, with validation and fallback to current UTC time.
- getUTCString · function · L27-L32 — Formats a date input as a localized UTC string using the Intl API with customizable format options.
