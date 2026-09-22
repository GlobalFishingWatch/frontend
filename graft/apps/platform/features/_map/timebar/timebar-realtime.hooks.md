# apps/platform/features/_map/timebar/timebar-realtime.hooks.ts · [[time-mode-real-time-state]] [[timebar-data-fetching-hooks]]

Hook that synchronizes the Redux store with real-time data updates at regular intervals aligned to a configured update schedule.

- useRealTimeDataUpdates · function · L9-L40 — Hook that schedules and manages periodic dispatches of the latest available real-time data date, with initial alignment to the next update interval boundary.
- clearTimers · function · L15-L24 — Cleanup function that clears both the initial timeout and the recurring interval to prevent memory leaks.
- tick · function · L26-L28 — Dispatches the latest available real-time data date to update the timebar state.
