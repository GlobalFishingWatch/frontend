---
name: Layout Mathematics
slug: layout-mathematics
type: file
sources:
  - path: libs/timebar/src/charts/charts.utils.ts
    hash: e705503c02bb4f70fed4fd144f4c47fa6e236ce03a50445f5b5e65011103881f
sources_digest: fce6c405f311cfd1f597b1e2b72201c19f4a11b6fb1f33908a32974dc89c3d95
links:
  - to: chart-rendering-engine
    relation: uses
    description: >-
      Provides layout constants and coordinate calculations for positioning
      track polygons and paths in deck.gl visualizations
generator:
  version: 1
covers:
  - symbol: getTrackY
    kind: function
    at: 'libs/timebar/src/charts/charts.utils.ts:L7-L28'
---

<!-- context:generated:start -->

## Summary

Charts utility module exporting vertical spacing constants (margins, track height) and the getTrackY function that computes precise y-coordinates for rendering multiple tracks. Supports three orientation modes (mirrored, up, down) and returns position objects consumed by all chart rendering components.

## Related

- uses [[chart-rendering-engine]] — Provides layout constants and coordinate calculations for positioning track polygons and paths in deck.gl visualizations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
