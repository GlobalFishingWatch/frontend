---
name: Track Selection and Undo
slug: track-selection-and-undo
type: system
sources:
  - path: apps/track-labeler/src/features/vessels/selectedTracks.slice.ts
    hash: c91edc78f60304af92da619e0b8d17fa69f83370e6af45f9b433540f48f5452a
sources_digest: 51c655f8211810eac179297b47bf6cb79ac6b4dc3dfe207cdfe32efa5942607f
links:
  - to: activity-type-ontology
    relation: uses
    description: >-
      Selected tracks store action labels that must match ActionType enum values
      (fishing, hauling, trawling, etc.)
  - to: track-labeler-vessel-metadata
    relation: depends_on
    description: >-
      Selected tracks reference vessel track data; segment selections are based
      on track indices and timestamps
generator:
  version: 1
covers:
  - symbol: SelectedTrackType
    kind: type
    at: 'apps/track-labeler/src/features/vessels/selectedTracks.slice.ts:L8-L16'
  - symbol: SelectedTrackSlice
    kind: type
    at: 'apps/track-labeler/src/features/vessels/selectedTracks.slice.ts:L18-L20'
  - symbol: selectedtracks
    kind: function
    at: 'apps/track-labeler/src/features/vessels/selectedTracks.slice.ts:L68-L68'
  - symbol: pastSelectedtracks
    kind: function
    at: 'apps/track-labeler/src/features/vessels/selectedTracks.slice.ts:L69-L69'
  - symbol: futureSelectedtracks
    kind: function
    at: 'apps/track-labeler/src/features/vessels/selectedTracks.slice.ts:L70-L70'
---

<!-- context:generated:start -->

## Summary

Manages labeling state for individual track segments via Redux with undo/redo support via redux-undo. Stores selected segments with timestamps, spatial bounds, and action labels in a flat array indexed by position.

## Related

- uses [[activity-type-ontology]] — Selected tracks store action labels that must match ActionType enum values (fishing, hauling, trawling, etc.)
- depends on [[track-labeler-vessel-metadata]] — Selected tracks reference vessel track data; segment selections are based on track indices and timestamps

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
