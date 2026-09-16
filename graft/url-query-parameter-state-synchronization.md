---
name: URL Query Parameter State Synchronization
slug: url-query-parameter-state-synchronization
type: concept
sources:
  - path: apps/track-labeler/src/features/map/map-controls/MapControls.tsx
    hash: 61da58e8fc48819129fed3ef3a112ead2f1e3cd19a25195684f1a2dcddc2def7
  - path: apps/track-labeler/src/features/sidebar/sidebar.hooks.ts
    hash: 31acff448427212d16cfed3d0082bc0896902adfb460729279361fe252d24cbe
  - path: apps/track-labeler/src/features/timebar/timebar.hooks.ts
    hash: ff368cee5d1e43e34af9b551176efa2c4fa4ad93d3585f56098bd52e6e398d80
sources_digest: 3f0e5f728410205f4db06a9c51b5bec1cfdd1c3fa345d9c565743d3ca797abfb
links: []
generator:
  version: 1
covers:
  - symbol: MapControls
    kind: function
    at: 'apps/track-labeler/src/features/map/map-controls/MapControls.tsx:L21-L161'
  - symbol: handleLayerToggle
    kind: function
    at: 'apps/track-labeler/src/features/map/map-controls/MapControls.tsx:L33-L40'
  - symbol: switchBasemap
    kind: function
    at: 'apps/track-labeler/src/features/map/map-controls/MapControls.tsx:L49-L51'
  - symbol: useSelectedTracksConnect
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L35-L265'
  - symbol: dispatchUpdateActionSelectedTrack
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L38-L39'
  - symbol: dispatchChangeMapPosition
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L40-L51'
  - symbol: dispatchDeleteSelectedTrack
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L52-L52'
  - symbol: getSelectedTracksAsGeoJson
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L62-L117'
  - symbol: dispatchUploadSelectedTracks
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L118-L150'
  - symbol: dispatchDownloadSelectedTracks
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L152-L162'
  - symbol: handleFileUploaded
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L167-L227'
  - symbol: dispatchImportHandler
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L233-L239'
  - symbol: dispatchUndo
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L243-L247'
  - symbol: dispatchRedo
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/sidebar.hooks.ts:L248-L252'
  - symbol: useTimerangeConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L24-L94'
  - symbol: useTimebarModeConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L96-L114'
  - symbol: dispatchTimebarMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L101-L102'
  - symbol: dispatchFilterMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L103-L104'
  - symbol: dispatchColorMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L105-L105'
  - symbol: useSegmentsLabeledConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L116-L294'
  - symbol: createNewSegment
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L128-L166'
  - symbol: handleSegmentOverlap
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L168-L244'
  - symbol: onEventPointClick
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L246-L287'
---

<!-- context:generated:start -->

## Summary

Application state for filters, hidden layers, basemap mode, and view bounds is synchronized bidirectionally with URL query parameters via updateQueryParams action and routes.selectors. This pattern enables browser back/forward navigation and shareable URLs with application state embedded. Hidden layers are comma-separated; satellite mode is a boolean flag; timerange filters are ISO strings. A design constraint: query param updates must be throttled to prevent excessive re-renders and URL history pollution during smooth interactions (e.g., viewport panning).
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
