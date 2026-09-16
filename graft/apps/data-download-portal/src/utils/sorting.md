# apps/data-download-portal/src/utils/sorting.tsx · [[data-download-portal-utilities]] [[defensive-utility-design-with-lenient-error-handling]]

- sortByName · function · L3-L10 — Sorts an array of download datasets alphabetically by name in ascending or descending order.
- sortByLastUpdated · function · L12-L18 — Sorts an array of download datasets by most recently updated first, pushing items without timestamps to the end.
- sortDatasets · function · L20-L33 — Routes dataset sorting requests to the appropriate sorting strategy based on the requested sort field and direction.
