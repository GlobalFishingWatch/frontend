# apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx · [[analytics-tracking]] [[authentication-and-access-control]] [[vessel-group-report-insights-system]]

Displays vessel group MOU (Memorandum of Understanding) insights with Paris and Tokyo list categorizations, allowing users to expand and navigate to individual vessels.

- ExpandedMOUInsights · type · L34-L34 — Template type that represents the unique identifier for an expanded MOU insight section, combining country and list name.
- VesselGroupReportInsightMOU · function · L36-L198 — Main component that renders MOU vessel insights for a vessel group, handling loading states, guest access restrictions, and toggling expanded/collapsed list views.
- onVesselClick · function · L47-L53 — Tracks analytics event when a user clicks on a vessel link within the MOU insights view.
- VesselsInMOUByCategory · function · L64-L113 — Sub-component that renders a collapsible list of vessels grouped by their MOU category (black or grey list) with vessel names and flag countries.
- getVesselsInMOU · function · L115-L156 — Factory function that generates collapsible MOU list sections for each category (black/grey), managing expansion state and user interaction tracking.
- onToggle · function · L116-L131 — Callback that updates the expansion state of a specific MOU list section and tracks user interactions with analytics.
