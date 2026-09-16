# apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx · [[analytics-tracking]] [[report-data-fetching-hooks]] [[vessel-group-report-insights-system]]

React component that displays fishing insights for a vessel group, showing activities in no-take marine protected areas and regional fisheries bodies with unauthorized fishing.

- VesselGroupReportInsightFishing · function · L37-L226 — Main component that renders fishing insights tabs for vessel groups, managing expansion state of MPA and RFMO collapsibles and querying vessel group insight data.
- onMPAToggle · function · L53-L67 — Toggles MPA insights expansion state and tracks user interaction analytics when the collapsible opens.
- onRFMOToggle · function · L69-L83 — Toggles RFMO insights expansion state and tracks user interaction analytics when the collapsible opens.
- onVesselClick · function · L85-L91 — Tracks analytics event when a user clicks on a vessel link within the insights view.
- getVesselGroupReportInsighFishingVessels · function · L93-L155 — Renders a list of vessels with their associated fishing events, maintaining collapsible state and displaying event counts per vessel.
