# apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabWrapper.tsx

Wraps the vessel identity tab UI, rendering identity information, transmission date range controls, download functionality, and identity selector.

- IdentityTabWrapper · function · L42-L176 — React component that wraps the vessel identity tab UI, managing selected identity data display, user permissions, timerange selection, and CSV export of vessel information.
- onTimeRangeClick · function · L63-L71 — Event handler that updates the timebar timerange to match the current vessel identity's transmission date span, with context awareness for standalone vessel location view.
- onDownloadClick · function · L73-L109 — Async event handler that exports the current vessel identity data as a filtered CSV file, applying date and SSVID filters to registry information and tracking the download event.
