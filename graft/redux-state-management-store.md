---
name: Redux State Management & Store
slug: redux-state-management-store
type: system
sources:
  - path: apps/track-labeler/src/features/main/main.container.ts
    hash: 87ed5caaeb911e19ada91a35b4cff64c08c678d65bf40078c608f548ca58b7c7
  - path: apps/track-labeler/src/features/projects/projects.slice.ts
    hash: a1a403ca9d15028660f0058309e742d697ba1e01df9b6068d9ec894b3d39e397
  - path: apps/track-labeler/src/features/rulers/rulers.slice.ts
    hash: 9058d2d2832b9eba8934689f9e42dac339ec6419f740300478dc91ff28b3410f
  - path: apps/track-labeler/src/features/sidebar/sidebar.container.ts
    hash: d67039020df4823df4d71bb88041d0a53287c1e5a52d15f4a6ec2cced06fa221
  - path: apps/track-labeler/src/features/timebar/timebar.slice.ts
    hash: ad17a22f1cf387274509d0e3704147242dbcfb3f40a5d926ad90bba818ffeaa7
  - path: apps/track-labeler/src/features/tracks/tracks.thunks.ts
    hash: f9bf5ba7cdbca0ed9a62a8b9f7665737bacdd8d3405ee853922a140ac959853c
sources_digest: ee8c0e52833936f877da88421c4b1195474a377c3ed5843d522a7b838feb662f
links:
  - to: map-rendering-visualization-layer
    relation: uses
    description: >-
      Map component subscribes to Redux selectors for track data, viewport
      state, layer visibility, basemap mode, and legend configuration.
  - to: sidebar-segment-labeling-interface
    relation: uses
    description: >-
      Sidebar dispatches track labeling actions (setSelectedTrack,
      addSelectedTrack) and reads vessel/segment state via selectors.
  - to: timebar-ui-data-filtering
    relation: uses
    description: >-
      Timebar slice manages highlightedTime and highlightedEvent state;
      selectors derive filtered track graphs and filter ranges from Redux state.
  - to: vessel-track-data-loading-transformation
    relation: uses
    description: >-
      Tracks thunk fetches vessel data and dispatches setVesselTrack actions to
      populate Redux state; selectors expose parsed/filtered tracks.
generator:
  version: 1
covers:
  - symbol: SelectedTrackType
    kind: type
    at: 'apps/track-labeler/src/features/projects/projects.slice.ts:L8-L16'
  - symbol: ProjectSlice
    kind: type
    at: 'apps/track-labeler/src/features/projects/projects.slice.ts:L18-L20'
  - symbol: selectedProject
    kind: function
    at: 'apps/track-labeler/src/features/projects/projects.slice.ts:L38-L38'
  - symbol: Ruler
    kind: type
    at: 'apps/track-labeler/src/features/rulers/rulers.slice.ts:L4-L15'
  - symbol: RulersSlice
    kind: type
    at: 'apps/track-labeler/src/features/rulers/rulers.slice.ts:L17-L22'
  - symbol: TimebarSlice
    kind: type
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L6-L20'
  - symbol: selectHighlightedTime
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L59-L59'
  - symbol: selectHighlightedEvent
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L60-L60'
  - symbol: selectTooltip
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L61-L61'
  - symbol: fetchTrack
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.thunks.ts:L28-L45'
  - symbol: trackNeedsFetch
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.thunks.ts:L53-L66'
  - symbol: importedTrackNeedsFetch
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.thunks.ts:L68-L73'
  - symbol: geojsonToSegments
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.thunks.ts:L83-L104'
  - symbol: extractTrackData
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.thunks.ts:L106-L120'
  - symbol: trackThunk
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.thunks.ts:L127-L199'
---

<!-- context:generated:start -->

## Summary

Manages global application state using Redux Toolkit, with slices for vessels, tracks, selected segments, routes, projects, timebar, and rulers. The store is connected to presentational components via react-redux's connect() HOC and useSelector/useDispatch hooks. RootState type centralizes state shape across the application.

## Related

- uses [[map-rendering-visualization-layer]] — Map component subscribes to Redux selectors for track data, viewport state, layer visibility, basemap mode, and legend configuration.
- uses [[sidebar-segment-labeling-interface]] — Sidebar dispatches track labeling actions (setSelectedTrack, addSelectedTrack) and reads vessel/segment state via selectors.
- uses [[timebar-ui-data-filtering]] — Timebar slice manages highlightedTime and highlightedEvent state; selectors derive filtered track graphs and filter ranges from Redux state.
- uses [[vessel-track-data-loading-transformation]] — Tracks thunk fetches vessel data and dispatches setVesselTrack actions to populate Redux state; selectors expose parsed/filtered tracks.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
