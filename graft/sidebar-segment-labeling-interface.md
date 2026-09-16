---
name: Sidebar & Segment Labeling Interface
slug: sidebar-segment-labeling-interface
type: system
sources:
  - path: apps/track-labeler/src/features/sidebar/sidebar.container.ts
    hash: d67039020df4823df4d71bb88041d0a53287c1e5a52d15f4a6ec2cced06fa221
  - path: apps/track-labeler/src/features/sidebar/sidebar.hooks.ts
    hash: 31acff448427212d16cfed3d0082bc0896902adfb460729279361fe252d24cbe
  - path: apps/track-labeler/src/features/sidebar/Sidebar.test.tsx
    hash: d84a5bd52bf878d48052594a921ff00689ad68f78f42616396b0502dd9e642bd
  - path: apps/track-labeler/src/features/sidebar/Sidebar.tsx
    hash: 64cc7d785cbf3a1413306631a1899ea08681664e9d5bbea655931fc601c96ba7
sources_digest: a1713d9e3b48d6d00ba15d06c208abceb7cc6289d9957978e690545612c06ce5
links:
  - to: map-rendering-visualization-layer
    relation: uses
    description: >-
      Sidebar onFitSelectedSegmentBoundsClick calls useMapSetViewState to
      pan/zoom to segment bounds; interacts with map instance via useDeckMap.
  - to: project-labeling-configuration
    relation: depends_on
    description: >-
      Sidebar reads availableLabelActions from project; getActionShortcuts
      selector derives keyboard bindings.
  - to: segment-labeling-track-annotation
    relation: uses
    description: >-
      Sidebar SegmentRowItem dropdown selectors dispatch
      dispatchUpdateActionSelectedTrack; sidebar handles segment deletion via
      dispatchDeleteSelectedTrack.
  - to: vessel-track-data-loading-transformation
    relation: uses
    description: >-
      useSelectedTracksConnect imports GeoJSON and calls extractLabeledTrack to
      map segments; exports labeled track via tracks.utils.
generator:
  version: 1
covers:
  - symbol: formatedDate
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/Sidebar.tsx:L43-L49'
  - symbol: SegmentRowItemProps
    kind: type
    at: 'apps/track-labeler/src/features/sidebar/Sidebar.tsx:L51-L59'
  - symbol: SegmentRowItem
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/Sidebar.tsx:L61-L127'
  - symbol: Sidebar
    kind: function
    at: 'apps/track-labeler/src/features/sidebar/Sidebar.tsx:L129-L405'
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
---

<!-- context:generated:start -->

## Summary

Primary control panel displaying vessel metadata, a virtualized segment list (react-window), and action buttons for import/export/save workflows. SegmentRowItem subcomponent renders individual segments with timestamp buttons, action dropdown selectors, and delete icons. Integrates keyboard shortcuts (Ctrl+Z/Y for undo/redo, configurable per-project via LABEL_HOTKEYS) via react-hot-keys. The useSelectedTracksConnect hook manages file I/O (upload labeled GeoJSON via GFWAPI, import GeoJSON, sync vessel metadata) and Redux dispatchers for track annotation. Access control enforced via allowedAppAccess/allowedProjectAccess selectors.

## Related

- uses [[map-rendering-visualization-layer]] — Sidebar onFitSelectedSegmentBoundsClick calls useMapSetViewState to pan/zoom to segment bounds; interacts with map instance via useDeckMap.
- depends on [[project-labeling-configuration]] — Sidebar reads availableLabelActions from project; getActionShortcuts selector derives keyboard bindings.
- uses [[segment-labeling-track-annotation]] — Sidebar SegmentRowItem dropdown selectors dispatch dispatchUpdateActionSelectedTrack; sidebar handles segment deletion via dispatchDeleteSelectedTrack.
- uses [[vessel-track-data-loading-transformation]] — useSelectedTracksConnect imports GeoJSON and calls extractLabeledTrack to map segments; exports labeled track via tracks.utils.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
