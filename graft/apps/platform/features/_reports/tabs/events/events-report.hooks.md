# apps/platform/features/_reports/tabs/events/events-report.hooks.ts · [[events-report-system]]

Exports custom React hooks for managing event report graph labels, fetching paginated event data with filtering, and tracking report state changes via hash comparison.

- useGetEventReportGraphLabel · function · L37-L64 — Returns a memoized callback that formats area labels for event report graphs based on the grouping strategy (flag, RFMO, FAO, or EEZ).
- FetchEventReportGraphEventsParams · type · L66-L71 — Type definition specifying the parameters required to fetch event report graph events including dataviews, date range, and optional includes.
- useFetchEventReportGraphEvents · function · L72-L124 — Returns a memoized function that fetches event data from the API for multiple dataviews with regional filtering and deduplication.
- useReportHash · function · L126-L143 — Manages a hash string representing the current report state and detects when the report becomes outdated due to parameter changes.
