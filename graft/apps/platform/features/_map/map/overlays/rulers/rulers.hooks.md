# apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts · [[redux-state-slices]] [[ruler-measurement-system]] [[url-query-parameter-persistence]]

Exports React hooks for managing ruler measurement overlays on the map, including creation, editing, deletion, and visibility toggling.

- useRulers · function · L17-L130 — Custom hook that manages ruler state and provides callbacks for creating, editing, deleting, and toggling ruler visibility on the map.
- useMapRulerInstance · function · L132-L143 — Creates and memoizes a RulersLayer deck.gl instance with current and editing rulers, returning null if no rulers exist.
