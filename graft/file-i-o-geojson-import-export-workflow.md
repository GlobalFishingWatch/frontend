---
name: File I/O & GeoJSON Import/Export Workflow
slug: file-i-o-geojson-import-export-workflow
type: concept
sources:
  - path: apps/track-labeler/src/features/sidebar/sidebar.hooks.ts
    hash: 31acff448427212d16cfed3d0082bc0896902adfb460729279361fe252d24cbe
sources_digest: 9e79ae2c6909390cb7b68c991cbc7463a5b4828ba2f103c01becf35914cc6a43
links:
  - to: segment-labeling-track-annotation
    relation: depends_on
    description: >-
      Export/import workflows serialize/deserialize SelectedTrackType objects
      to/from GeoJSON via extractLabeledTrack and fixCoordinates.
generator:
  version: 1
covers:
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

Labeled track segments are exported as GeoJSON Blob and uploaded via FormData to GFWAPI's /labels/uploads endpoint; imports parse uploaded GeoJSON files, extract track features, sync vessel metadata, and restore project labels via setImportedData/setProject actions. The workflow handles timestamp-based segment matching to annotate exported points with label IDs, and deduplicates labels by ID during import to avoid redundancy. Browser APIs (Blob, URL.createObjectURL, FormData) mediate file operations in sidebar.hooks via useSelectedTracksConnect.

## Related

- depends on [[segment-labeling-track-annotation]] — Export/import workflows serialize/deserialize SelectedTrackType objects to/from GeoJSON via extractLabeledTrack and fixCoordinates.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
