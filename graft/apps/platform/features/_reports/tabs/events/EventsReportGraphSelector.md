# apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx · [[analytics-tracking]] [[events-report-system]] [[redux-report-state]] [[report-hash-and-url-sync]]

React component that renders a dropdown selector for choosing different event graph visualization modes (evolution or grouping by flag/RFMO/FAO/EEZ) in the reports interface.

- EventsReportGraphSelectorProps · type · L23-L26 — Type definition specifying the props for the EventsReportGraphSelector component: disabled flag and optional container class name.
- EventsReportGraphSelector · function · L28-L95 — React component that renders a choice UI for selecting between different event graph visualization types, conditionally showing regional grouping options for global reports.
- onSelect · function · L71-L80 — Handler that updates the report events graph selection, fits the viewport, and tracks the user's graph type choice.
