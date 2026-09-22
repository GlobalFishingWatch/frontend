# apps/platform/features/_vessels/vessel/activity/activity-by-voyage/VoyageGroup.tsx · [[vessel-activity-event-system]]

A React component that displays a collapsible voyage group header showing event count, date range, and port locations, with controls to expand, download events, and highlight on map.

- EventProps · interface · L19-L26 — Defines the props contract for a voyage group component, including event data and callbacks for user interactions.
- VoyageGroup · function · L28-L137 — React component that renders a collapsible voyage group with a formatted label, event count, date range, and action buttons for downloading and map navigation.
- onDownloadClick · function · L74-L82 — Exports voyage events to a CSV file and triggers the browser download with a formatted filename.
