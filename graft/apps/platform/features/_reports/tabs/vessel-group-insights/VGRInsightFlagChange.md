# apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx · [[analytics-tracking]] [[authentication-and-access-control]] [[vessel-group-report-insights-system]]

Displays a collapsible insight panel showing vessels within a vessel group that have undergone flag changes during a specified reporting period.

- VesselGroupReportInsightFlagChange · function · L28-L122 — React component that renders vessel group flag change insights with conditional views based on guest user status, loading state, errors, and available flag change data.
- onInsightToggle · function · L41-L52 — Callback that manages the collapsible state of the flag changes section and tracks analytics when the insight is expanded.
- onVesselClick · function · L54-L60 — Callback that tracks analytics events when a user clicks on a vessel link in the flag changes list.
