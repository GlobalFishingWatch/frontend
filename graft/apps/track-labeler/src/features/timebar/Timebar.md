# apps/track-labeler/src/features/timebar/Timebar.tsx · [[throttled-state-updates-for-ui-responsiveness]] [[timebar-ui-data-filtering]]

React component that renders an interactive timebar with vessel track visualization, time-range selection, and multi-field filtering (speed, elevation, hours, distance from port).

- DayNightTimebarLayer · function · L38-L72 — Component that renders semi-transparent day/night visual overlays on the timebar to indicate daytime segments.
- TimebarWrapper · function · L75-L315 — Main wrapper component that orchestrates the timebar UI with range selection, filter sliders, keyboard navigation, and highlighted time/event visualization.
- handleSpeedChange · function · L122-L124 — Dispatches the speed filter values to update the global state when the speed range slider changes.
- handleElevationChange · function · L125-L127 — Dispatches the elevation filter values to update the global state when the elevation range slider changes.
- handleDistanceFromPortChange · function · L128-L130 — Dispatches the distance from port filter values to update the global state when the distance range slider changes.
- handleTimeChange · function · L131-L133 — Dispatches the hour filter values to update the global state when the time range slider changes.
