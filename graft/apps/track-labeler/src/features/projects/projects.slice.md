# apps/track-labeler/src/features/projects/projects.slice.ts · [[project-labeling-configuration]] [[redux-state-management-store]]

Redux slice module that manages project state and provides selectors for accessing the selected project.

- SelectedTrackType · type · L8-L16 — Type definition for track selection metadata including start/end coordinates and associated action.
- ProjectSlice · type · L18-L20 — Type definition for the projects Redux slice state shape containing an optional project.
- selectedProject · function · L38-L38 — Selector function that retrieves the currently selected project from the root Redux state.
