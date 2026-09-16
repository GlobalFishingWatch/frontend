# apps/platform/features/hints/hints.slice.ts · [[hint-dismissal-persistence]] [[hints-contextual-help]]

Redux slice that manages the state of dismissed hints, including actions to hydrate, reset, and dismiss individual hints with persistence to local storage.

- HintsDismissed · type · L10-L10 — Type alias that maps hint IDs to boolean flags indicating whether each hint has been dismissed.
- HintsState · interface · L12-L14 — Interface that defines the shape of the hints slice state, holding an optional record of dismissed hints.
- selectHintsDismissed · function · L50-L50 — Selector function that extracts the dismissed hints record from the Redux root state.
