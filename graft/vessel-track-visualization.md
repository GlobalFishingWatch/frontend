---
name: Vessel Track Visualization
slug: vessel-track-visualization
type: concept
sources:
  - path: apps/platform/features/_vessels/search/basic/TrackFootprint.tsx
    hash: 8cd35d2cac209d1829bbc38fdbb1396e0653ee737103894d7467714df4b2c715
sources_digest: d15248a3d0f9a98af59b3e1e753dfbe70bfe0e8b93bf340a09e91719c1c742ed
links:
  - to: vessel-search-system
    relation: part_of
    description: >-
      TrackFootprint is rendered conditionally in SearchBasicResult for
      non-mobile screens; fetches track data via GFWAPI and highlights specific
      years on demand
generator:
  version: 1
covers:
  - symbol: TrackFootprintProps
    kind: type
    at: 'apps/platform/features/_vessels/search/basic/TrackFootprint.tsx:L20-L25'
  - symbol: TrackFootprint
    kind: function
    at: 'apps/platform/features/_vessels/search/basic/TrackFootprint.tsx:L38-L208'
---

<!-- context:generated:start -->

## Summary

Canvas-based rendering of historical vessel movement footprints with lazy data fetching, year-level filtering, and dynamic density scaling for high-DPI displays. Integrates geographic projections (geoEqualEarth) and turf.js for area computation.

## Related

- part of [[vessel-search-system]] — TrackFootprint is rendered conditionally in SearchBasicResult for non-mobile screens; fetches track data via GFWAPI and highlights specific years on demand

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
