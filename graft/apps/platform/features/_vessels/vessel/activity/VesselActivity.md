# apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx · [[cross-feature-scroll-synchronization]] [[event-grouping-summarization]] [[vessel-activity-event-system]] [[virtualized-list-rendering]]

React component module that displays vessel activity data grouped by activity type or voyage with mode switching and loading/error handling.

- VesselActivity · function · L22-L96 — Main React component that renders vessel activity summary and dynamically displays activity details filtered by selected mode (type or voyage).
- setActivityMode · function · L30-L36 — Updates the activity display mode (type or voyage) in query parameters and tracks the user interaction for analytics.
