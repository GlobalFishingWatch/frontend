# apps/platform/features/_map/map/controls/map-controls.slice.ts · [[map-control-state]] [[map-controls-system]]

- MapControl · type · L13-L16 — Union type constraining the set of valid map control identifiers to annotations, rulers, or error notifications.
- MapControlValue · type · L17-L17 — Union type allowing a map control to hold an annotation, ruler data, or null.
- MapControlState · type · L19-L22 — Type representing the state of a single map control with an editing flag and a value.
- MapControlsSlice · type · L24-L28 — Root state shape for all map controls, mapping each control type to its state and including a search UI flag.
- LazyLoadedSlices · interface · L100-L100 — Module augmentation interface registering the map controls slice as a lazy-loaded reducer in the root store.
- selectMapControlEditing · function · L104-L107 — Selector that retrieves the editing state of a specified map control.
- selectMapControlValue · function · L109-L113 — Selector that retrieves the value of a specified map control with optional type narrowing.
