# apps/platform/features/_map/timebar/timebar.slice.ts · [[timebar-data-connections]]

Redux slice managing timebar state including highlighted time ranges, events, and real-time updates for the map feature.

- TimeRange · type · L7-L10 — Type definition for a time range with start and end string timestamps.
- TimebarSlice · type · L12-L18 — Type definition for the timebar Redux slice state shape containing highlighted time, events, and settings flags.
- selectHighlightedTime · function · L64-L64 — Selector that retrieves the currently highlighted time range from Redux state.
- selectHighlightedEventSelected · function · L65-L66 — Selector that retrieves the currently selected highlighted event from Redux state.
- selectHoveredHighlightedEvents · function · L67-L67 — Selector that retrieves the list of hovered highlighted events from Redux state.
- selectHasChangedSettingsOnce · function · L68-L69 — Selector that retrieves the flag indicating whether settings have been changed at least once from Redux state.
- selectRealTimeLatestUpdate · function · L70-L70 — Selector that retrieves the timestamp of the latest real-time update from Redux state.
