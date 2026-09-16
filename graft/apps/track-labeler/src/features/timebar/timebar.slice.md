# apps/track-labeler/src/features/timebar/timebar.slice.ts · [[redux-state-management-store]] [[timebar-ui-data-filtering]]

Redux slice module that defines timebar state management with reducers for updating highlighted time, highlighted event, and tooltip state.

- TimebarSlice · type · L6-L20 — Type definition for the timebar Redux slice state, containing optional highlighted time/event intervals and a nullable tooltip string.
- selectHighlightedTime · function · L59-L59 — Selector function to extract the highlighted time interval from the root Redux state.
- selectHighlightedEvent · function · L60-L60 — Selector function to extract the highlighted event interval from the root Redux state.
- selectTooltip · function · L61-L61 — Selector function to extract the tooltip string from the root Redux state.
