# apps/platform/features/_reports/tabs/activity/ReportActivityPeriodComparison.tsx · [[activity-report-ui-components]] [[analytics-and-navigation]] [[internationalization-i18n-and-formatting]]

A React component that provides a UI for comparing activity metrics between two time periods with configurable duration.

- ReportActivityPeriodComparison · function · L21-L173 — Renders a time period comparison UI with baseline date, comparison date, and duration inputs that syncs with report state and tracks user interactions.
- trackAndChangeComparisonDate · function · L38-L51 — Logs the selection of a comparison period date and applies the date change to report state.
- trackAndChangeBaselineDate · function · L53-L66 — Logs the selection of a baseline period date and applies the date change to report state.
- trackAndChangeDuration · function · L68-L81 — Logs the duration value change and updates the comparison period duration in report state.
- trackAndChangeDurationType · function · L83-L96 — Logs the duration type (days or months) selection and updates the comparison period duration type in report state.
