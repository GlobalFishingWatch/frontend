# apps/platform/features/_vessels/vessel/activity/VesselActivityDownload.tsx · [[guest-permission-guards]] [[vessel-activity-event-system]]

React component that provides a download button for vessel activity events filtered by time range, with CSV export and analytics tracking.

- VesselActivityDownload · function · L19-L64 — React component that renders a download button for vessel activity events, with guards against loading state and unauthenticated access.
- onDownloadClick · function · L29-L48 — Async handler that converts vessel events to CSV, generates a filename from vessel metadata and timerange, exports the file, and tracks the download analytics event.
