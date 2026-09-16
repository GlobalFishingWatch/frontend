---
name: Timebar Deck.GL Rendering Layer
slug: timebar-deck-gl-rendering-layer
type: file
sources:
  - path: libs/timebar/src/charts/charts.deck.tsx
    hash: 90e992816d6f3f1b271546ea4bd6e1f52697e8257abd86ec64e99eb4032d3b69
sources_digest: a1bef6dab4d75f727b756c64bb93ec5afd910adaec5c02d6bfb1521502bbee02
links:
  - to: timebar-chart-hooks-data-transformation
    relation: uses
    description: Uses useOuterScale to compute orthographic viewport scaling
  - to: timebar-chart-state-management
    relation: uses
    description: >-
      Subscribes to activeChartLayersState and isAnyChartLoading for rendering
      data and loading state
generator:
  version: 1
covers:
  - symbol: TimebarDeckglWrapper
    kind: function
    at: 'libs/timebar/src/charts/charts.deck.tsx:L19-L64'
---

<!-- context:generated:start -->

## Summary

TimebarDeckglWrapper renders an interactive 2D WebGL timeline visualization using deck.gl's OrthographicView and Layer system. It orchestrates viewport state via useOuterScale (time-domain to pixel mapping), consumes layers from the charts store, and manages pick interactions for hover effects with cursor feedback.

## Related

- uses [[timebar-chart-hooks-data-transformation]] — Uses useOuterScale to compute orthographic viewport scaling
- uses [[timebar-chart-state-management]] — Subscribes to activeChartLayersState and isAnyChartLoading for rendering data and loading state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
