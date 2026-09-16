# apps/platform/features/_map/workspace/shared/Remove.tsx · [[layer-removal-and-cleanup]]

React component for removing dataview instances from the workspace with customizable behavior and optional delete confirmation.

- RemoveProps · type · L9-L15 — Configuration props type for the Remove component specifying optional callback, styling, dataview reference, loading state, and test identifier.
- Remove · function · L17-L46 — React component that renders a delete icon button with configurable onClick handler that either delegates to a custom callback or deletes the associated dataview instance.
