# apps/track-labeler/src/features/vessels/selectedTracks.slice.ts · [[track-selection-and-undo]]

Redux slice for managing selected track segments with undo/redo capability.

- SelectedTrackType · type · L8-L16 — Type defining the properties of a single track segment including start/end coordinates and associated action.
- SelectedTrackSlice · type · L18-L20 — Type defining the Redux slice state structure as a collection of track segments.
- selectedtracks · function · L68-L68 — Selector that retrieves the current list of selected track segments from Redux state.
- pastSelectedtracks · function · L69-L69 — Selector that retrieves the history of past selected track segment states for undo functionality.
- futureSelectedtracks · function · L70-L70 — Selector that retrieves the history of future selected track segment states for redo functionality.
