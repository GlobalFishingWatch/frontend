# apps/platform/features/_reports/tabs/events/events.report.download.ts · [[event-type-hierarchical-csv-schema]] [[events-report-system]]

Exports CSV configuration presets and a parser function to convert event data into formatted CSV for different event types (Encounter, Port Visit, and generic events).

- parseReportEventsToCSV · function · L51-L60 — Selects the appropriate CSV schema based on event type and converts an array of API events into CSV format.
