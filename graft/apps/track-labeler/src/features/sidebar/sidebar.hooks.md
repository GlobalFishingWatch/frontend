# apps/track-labeler/src/features/sidebar/sidebar.hooks.ts · [[file-i-o-geojson-import-export-workflow]] [[sidebar-segment-labeling-interface]] [[url-query-parameter-state-synchronization]]

Custom hook that manages track labeling operations including uploading, downloading, importing labeled tracks, and undo/redo functionality for a vessel track labeler application.

- useSelectedTracksConnect · function · L35-L265 — Custom React hook that provides track selection management with upload, download, import, undo/redo, and map navigation capabilities.
- dispatchUpdateActionSelectedTrack · function · L38-L39 — Dispatches a Redux action to update the action type associated with a selected track at a given index.
- dispatchChangeMapPosition · function · L40-L51 — Dispatches query parameter updates to move the map view to either the start or end position of a track segment.
- dispatchDeleteSelectedTrack · function · L52-L52 — Dispatches a Redux action to remove a selected track segment at the specified index.
- getSelectedTracksAsGeoJson · function · L62-L117 — Converts selected track segments into GeoJSON FeatureCollection format with vessel metadata and labeled points.
- dispatchUploadSelectedTracks · function · L118-L150 — Uploads labeled track data to the API as a GeoJSON file with vessel and project metadata.
- dispatchDownloadSelectedTracks · function · L152-L162 — Exports selected track segments as a downloadable GeoJSON file to the user's device.
- handleFileUploaded · function · L167-L227 — Processes imported GeoJSON files to restore track data, vessel info, project metadata, and selected segments into the store.
- dispatchImportHandler · function · L233-L239 — Handles file input selection event and reads the selected file as text for import processing.
- dispatchUndo · function · L243-L247 — Dispatches an undo action to restore the previous state of track selections when the undo history is available.
- dispatchRedo · function · L248-L252 — Dispatches a redo action to restore the next state of track selections when the redo history is available.
