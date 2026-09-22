# apps/platform/features/_map/download/downloadActivity.hooks.ts · [[activity-download-timeout-retry-loop]]

Custom React hooks for managing download activity timeout and refresh behavior in the map feature.

- useActivityDownloadTimeoutRefresh · function · L11-L30 — Hook that automatically retries failed download activity requests by polling the last report every 10 seconds when a timeout error occurs.
