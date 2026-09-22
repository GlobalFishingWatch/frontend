---
name: Antimeridian Crossing Workaround
slug: antimeridian-crossing-workaround
type: concept
sources:
  - path: apps/track-labeler/src/features/tracks/tracks.utils.ts
    hash: 56bb892c6f9d47c7c495a26ffb6ed084f5d6a9716decfd3282cf52deb46d122a
sources_digest: 5e38b9cbbb7b9aa69b6aa16494563907b2ef3487ada3604d24ce8771a45bf385
links:
  - to: vessel-track-data-loading-transformation
    relation: implements
    description: >-
      fixCoordinates is called during GeoJSON import (geojsonToSegments) and
      export workflows to handle antimeridian crossing.
generator:
  version: 1
covers:
  - symbol: extractLabeledTrack
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.utils.ts:L4-L76'
  - symbol: fixCoordinates
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.utils.ts:L78-L108'
---

<!-- context:generated:start -->

## Summary

Geographic tracks crossing the International Date Line (±180° longitude) exhibit coordinate discontinuities that cause map renderers (Mapbox GL, Leaflet, Deck.GL) to draw lines across the entire globe. The fixCoordinates utility detects jumps >90° in consecutive longitude values and applies cumulative offsets to normalize coordinates into a continuous space, enabling proper visualization of polar routes and trans-oceanic transits without visual artifacts.

## Related

- implements [[vessel-track-data-loading-transformation]] — fixCoordinates is called during GeoJSON import (geojsonToSegments) and export workflows to handle antimeridian crossing.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
