---
name: Vessel Track Data Loading & Transformation
slug: vessel-track-data-loading-transformation
type: system
sources:
  - path: apps/track-labeler/src/features/tracks/__mocks__/vesselTrack.mock.ts
    hash: 7063ae39cf73d36e4df483dece0fbe0f5df7ba349be0919725515433fe043f33
  - path: apps/track-labeler/src/features/tracks/track.selectors.test.ts
    hash: e3b3a1512962712b0ceabcf8097ec18b67d47b45492c74a01c0a39c581f8a9d9
  - path: apps/track-labeler/src/features/tracks/tracks.selectors.ts
    hash: 5eaaa04c11b7ef03c2455e90752dd88032cdcdebc24d53f018372f842d6ffd36
  - path: apps/track-labeler/src/features/tracks/tracks.thunks.ts
    hash: f9bf5ba7cdbca0ed9a62a8b9f7665737bacdd8d3405ee853922a140ac959853c
  - path: apps/track-labeler/src/features/tracks/tracks.utils.ts
    hash: 56bb892c6f9d47c7c495a26ffb6ed084f5d6a9716decfd3282cf52deb46d122a
sources_digest: 487d2e4a9629a8084a110ed922ad362d34491174089f52af0da249eabc269668
links:
  - to: antimeridian-crossing-workaround
    relation: uses
    description: >-
      fixCoordinates utility normalizes ±180° longitude jumps to prevent map
      rendering artifacts.
  - to: map-rendering-visualization-layer
    relation: produces
    description: >-
      Selectors export selectDirectionPointsData as TrackLabelerPoint[] for
      Deck.GL rendering; selectLegendLabels provides action-type color coding.
  - to: timebar-ui-data-filtering
    relation: produces
    description: >-
      Selectors feed filtered track data to timebar via selectTracksGraphs and
      range-min-max selectors.
generator:
  version: 1
covers:
  - symbol: PointEvent
    kind: type
    at: 'apps/track-labeler/src/features/tracks/tracks.selectors.ts:L95-L95'
  - symbol: getCurrentVesselAction
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.selectors.ts:L185-L205'
  - symbol: getNodeAction
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.selectors.ts:L191-L199'
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
  - symbol: extractLabeledTrack
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.utils.ts:L4-L76'
  - symbol: fixCoordinates
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.utils.ts:L78-L108'
---

<!-- context:generated:start -->

## Summary

Orchestrates fetching and parsing vessel track data from the Global Fishing Watch API or imported GeoJSON files. The trackThunk async thunk checks cache (trackNeedsFetch) and either calls fetchTrack (GFWAPI with API_VERSION, TRACK_FIELDS config) or processes imported GeoJSON via geojsonToSegments. Helper functions extract TrackSegment/TrackPoint arrays, handle date range filtering, and build searchable timestamp indices. Tracks selectors (getVesselParsedTrack, getVesselParsedFilteredTrack) apply segment-based action labels using a functional red-black tree for O(log n) timestamp lookups, and derive map-ready GeoJSON features with metadata (speed, course, action).

## Related

- uses [[antimeridian-crossing-workaround]] — fixCoordinates utility normalizes ±180° longitude jumps to prevent map rendering artifacts.
- produces [[map-rendering-visualization-layer]] — Selectors export selectDirectionPointsData as TrackLabelerPoint[] for Deck.GL rendering; selectLegendLabels provides action-type color coding.
- produces [[timebar-ui-data-filtering]] — Selectors feed filtered track data to timebar via selectTracksGraphs and range-min-max selectors.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
