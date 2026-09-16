# apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx · [[analytics-tracking]] [[report-data-fetching-hooks]] [[vessel-group-report-insights-system]]

React component that displays longline fishing events and vessel activity within a vessel group report, including filtering by category, downloading event data, and expanding vessel details.

- VesselWithEvents · type · L32-L37 — Data structure that groups events by vessel identity and metadata.
- getVesselsWithEvents · function · L39-L51 — Aggregates events by vessel identity and returns vessels sorted by event count in descending order.
- VesselGroupReportInsightLongline · function · L53-L191 — Main component that fetches and renders longline fishing events for vessel groups with interactive category and vessel expansion controls.
- onDownloadClick · function · L78-L87 — Exports longline events to CSV format and triggers an analytics event for download tracking.
- onCategoryToggle · function · L89-L98 — Clears vessel expansion state and logs analytics when longline category is toggled.
- onVesselClick · function · L100-L106 — Tracks user navigation when clicking on a vessel link within the longline insights view.
- renderCategoryVessels · function · L108-L153 — Renders an expandable list of vessels with their longline events, allowing users to toggle event details per vessel.
