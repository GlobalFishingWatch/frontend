---
name: Track Labeler Vessel Metadata
slug: track-labeler-vessel-metadata
type: system
sources:
  - path: apps/track-labeler/src/features/vessels/__mocks__/selectedtracks.mock.ts
    hash: d02f96e307f201658bd92cd97106fd64e6ba914f4206410c02ccec58ddcea40d
  - path: apps/track-labeler/src/features/vessels/__mocks__/vessels.slice.ts
    hash: 9c6798f0e97d97556b6e05ad35eb2de8e1ae0110b1bc21564433a0299ddcbb2b
  - path: apps/track-labeler/src/features/vessels/vessels.slice.ts
    hash: ef225949f163dcd8246bb2e3ab6f823f354b6b9a4f73843313d7b1508c4dc74c
  - path: apps/track-labeler/src/features/vessels/vessels.thunks.ts
    hash: 5f325d26d585554f72f6b1e53a7f51640542372079732e2ef1de9bc88be5174d
sources_digest: 07a0b2d88a4e1492c980745db3b9e3408ab8aace8864b653cbdf4bec7dcdfe9b
links:
  - to: global-fishing-watch-api-client
    relation: uses
    description: >-
      vesselInfoThunk calls GFWAPI.fetch to retrieve vessel metadata from
      /vessels/{id} endpoint
  - to: query-driven-state-synchronization
    relation: produces
    description: >-
      Track timestamps are indexed and exposed via Redux selectors for URL query
      filtering
  - to: track-selection-and-undo
    relation: depends_on
    description: >-
      Selected tracks interact with vessel data to label segments; Redux
      undo/redo manages labeling history
generator:
  version: 1
covers:
  - symbol: Dictionary
    kind: interface
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L10-L12'
  - symbol: VesselDynamicField
    kind: type
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L14-L18'
  - symbol: Vessel
    kind: type
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L20-L28'
  - symbol: CoordinateProperties
    kind: type
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L29-L35'
  - symbol: TrackGeometry
    kind: type
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L37-L37'
  - symbol: TrackInterface
    kind: type
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L39-L44'
  - symbol: TrackItem
    kind: interface
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L45-L51'
  - symbol: VesselInfo
    kind: interface
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L53-L60'
  - symbol: Tracks
    kind: interface
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L62-L64'
  - symbol: VesselsSlice
    kind: type
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L66-L73'
  - symbol: selectVessels
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L153-L153'
  - symbol: selectTracks
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L154-L154'
  - symbol: selectOriginalTracks
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L155-L155'
  - symbol: selectEvents
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L156-L156'
  - symbol: selectImportedData
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L157-L157'
  - symbol: selectTimestamps
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.slice.ts:L158-L158'
  - symbol: fetchVesselInfo
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.thunks.ts:L14-L24'
  - symbol: vesselInfoThunk
    kind: function
    at: 'apps/track-labeler/src/features/vessels/vessels.thunks.ts:L27-L52'
---

<!-- context:generated:start -->

## Summary

Manages vessel and track data storage, fetching, and caching via Redux slices. Stores both current and original track copies to enable comparison; maintains searchable timestamp indices for time-based filtering.

## Related

- uses [[global-fishing-watch-api-client]] — vesselInfoThunk calls GFWAPI.fetch to retrieve vessel metadata from /vessels/{id} endpoint
- produces [[query-driven-state-synchronization]] — Track timestamps are indexed and exposed via Redux selectors for URL query filtering
- depends on [[track-selection-and-undo]] — Selected tracks interact with vessel data to label segments; Redux undo/redo manages labeling history

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
