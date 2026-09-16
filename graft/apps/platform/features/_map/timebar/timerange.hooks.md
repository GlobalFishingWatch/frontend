# apps/platform/features/_map/timebar/timerange.hooks.ts · [[time-range-management]]

- isValidISODate · function · L31-L31 — Validates whether a string is a parseable ISO date.
- getTimerangeFromUrl · function · L33-L48 — Extracts and validates time range start and end dates from URL search parameters.
- useSetTimerange · function · L61-L118 — Provides a callback that updates the time range atom, enforces minimum 24-hour duration in non-realTime mode, snaps to intervals, and debounces URL updates.
- useTimerangeConnect · function · L120-L144 — Connects the timebar UI changes to the time range state management, determining whether to snap to intervals based on the source of the change.
