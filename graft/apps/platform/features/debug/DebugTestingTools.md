# apps/platform/features/debug/DebugTestingTools.tsx · [[debug-system]] [[deterministic-state-serialization]]

Debug utility module that provides tools for extracting and copying Redux application state to clipboard.

- sortObjectKeysDeep · function · L12-L34 — Recursively sorts all object keys alphabetically and primitive arrays in-place to normalize state structure for consistent serialization.
- DebugTestingTools · function · L36-L84 — React component that renders a debug panel with buttons to copy Redux state with initial or current location state.
- getStringifyState · function · L39-L52 — Serializes the current Redux state with optionally substituted location and debug state, with all keys sorted for consistency.
