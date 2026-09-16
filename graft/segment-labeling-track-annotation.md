---
name: Segment Labeling & Track Annotation
slug: segment-labeling-track-annotation
type: system
sources:
  - path: apps/track-labeler/src/features/timebar/timebar.hooks.ts
    hash: ff368cee5d1e43e34af9b551176efa2c4fa4ad93d3585f56098bd52e6e398d80
  - path: apps/track-labeler/src/features/tracks/tracks.utils.test.ts
    hash: 8e50eba90d08fe9b70980a18c2f3e594da37def9f9a3cf9c59236cf0dd12c2ec
  - path: apps/track-labeler/src/features/tracks/tracks.utils.ts
    hash: 56bb892c6f9d47c7c495a26ffb6ed084f5d6a9716decfd3282cf52deb46d122a
sources_digest: 3cb1e2e6a763b666eb8d431e61e38dfb1637e2070a3cf54b410b58b48d6721e8
links:
  - to: sidebar-segment-labeling-interface
    relation: produces
    description: >-
      useSelectedTracksConnect exports labeled segments via extractLabeledTrack;
      sidebar's file I/O dispatches upload/import actions.
  - to: vessel-track-data-loading-transformation
    relation: depends_on
    description: >-
      Segment creation relies on findNextPosition, findNextTimestamp utility
      functions that index into track point arrays.
generator:
  version: 1
covers:
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
  - symbol: extractLabeledTrack
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.utils.ts:L4-L76'
  - symbol: fixCoordinates
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.utils.ts:L78-L108'
---

<!-- context:generated:start -->

## Summary

Manages the creation, editing, and deletion of labeled track segments. selectedTracks.slice Redux reducer stores SelectedTrackType objects (start/end coordinates and timestamps with action type). The useSegmentsLabeledConnect hook implements two-click segment creation with overlap detection and resolution: complete containment splits the original segment, complete absorption removes it, and partial overlaps trim boundaries. Relies on synchronized timestamp/position arrays from tracks.selectors; notably, the hook maintains transient pendingSegment state separately from Redux to track the first click.

## Related

- produces [[sidebar-segment-labeling-interface]] — useSelectedTracksConnect exports labeled segments via extractLabeledTrack; sidebar's file I/O dispatches upload/import actions.
- depends on [[vessel-track-data-loading-transformation]] — Segment creation relies on findNextPosition, findNextTimestamp utility functions that index into track point arrays.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
