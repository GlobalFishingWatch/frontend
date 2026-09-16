# apps/platform/utils/text.tsx · [[platform-app-utilities]] [[text-processing-highlighting]]

Utility module providing text processing functions for highlighting search terms and generating preview excerpts from search results.

- getHighlightedText · function · L3-L36 — Splits text into highlighted and non-highlighted segments based on matching terms and returns JSX elements with styling applied to matched portions.
- regEscape · function · L16-L16 — Escapes special regex metacharacters in a string to allow literal matching within regex patterns.
- getSearchPreview · function · L38-L45 — Extracts a contextual preview snippet from a body of text centered around a query match with ellipsis indicators for truncation.
