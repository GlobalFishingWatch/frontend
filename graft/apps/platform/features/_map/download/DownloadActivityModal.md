# apps/platform/features/_map/download/DownloadActivityModal.tsx · [[activity-download-timeout-retry-loop]] [[download-ui-form-components]]

A React modal component that manages tabbed download interfaces for activity data, environmental data, and gridded data with survey prompt integration.

- DownloadActivityModal · function · L32-L116 — Modal component that manages download options across vessel activity, gridded activity, and environmental data tabs with survey integration and error handling.
- onTabClick · function · L85-L87 — Dispatches the active tab change to Redux state when the user switches between download content tabs.
- onClose · function · L89-L95 — Resets download activity state differently based on whether a download is in progress or has encountered a timeout error.
