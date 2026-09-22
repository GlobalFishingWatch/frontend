# apps/platform/utils/shared.ts · [[i18n-system]] [[platform-app-utilities]] [[string-data-formatting-utilities]]

Utility module providing string formatting, field sorting, and text transformation helpers for shared application logic.

- capitalize · function · L5-L8 — Capitalizes the first character of a string, returning an empty string for non-string inputs.
- toFixed · function · L10-L16 — Rounds a number to a specified decimal precision and returns it as a fixed-point string, with validation and fallback.
- Field · type · L18-L18 — Type definition for a labeled field with a string or numeric identifier and a displayable label.
- sortStrings · function · L20-L20 — Comparator function that sorts two strings using locale-aware collation.
- sortFields · function · L22-L38 — Comparator function that sorts Field objects by their label (or fallback to id), handling mixed types and missing values.
- listAsSentence · function · L40-L45 — Converts a string array into a human-readable sentence using 'and' or 'or' conjunction with i18n support.
