---
name: Deck.GL Layer Composition System
slug: deck-gl-layer-composition-system
type: system
sources:
  - path: apps/track-labeler/src/features/map/map-layers.dataviews.ts
    hash: 6964988de3e6c45f0c8a1b031001e4e47b84f14415e42a95840c31a38bf372a1
  - path: apps/track-labeler/src/features/map/map-layers.hooks.ts
    hash: dfda87e8ec16e96bca5940769d7f0497c64c6342e85674ccf1ec7a0d44499f01
  - path: apps/track-labeler/src/features/map/map-layers.selectors.ts
    hash: 215a09d8f15a047fcce9838b78e96c653ba9263eb51d540e43f10bcda155ded4
sources_digest: cf7d04d5b72204c3b1df0df3aad2b7ab5dc61b9e558372e9ecbeb7322fc74593
links:
  - to: ruler-drawing-tool
    relation: uses
    description: useMapRulerInstance creates RulersLayer from rulers.selectors state.
  - to: timebar-ui-data-filtering
    relation: uses
    description: >-
      useTrackLabelerDeckLayer reads selectHighlightedTime to compute
      millisecond time windows for point highlighting.
  - to: vessel-track-data-loading-transformation
    relation: depends_on
    description: >-
      useTrackLabelerDeckLayer subscribes to selectDirectionPointsData and
      selectLegendLabels selectors derived from parsed tracks.
generator:
  version: 1
covers:
  - symbol: useTrackLabelerDeckLayer
    kind: function
    at: 'apps/track-labeler/src/features/map/map-layers.hooks.ts:L17-L66'
  - symbol: useMapRulerInstance
    kind: function
    at: 'apps/track-labeler/src/features/map/map-layers.hooks.ts:L68-L78'
  - symbol: useMapDataviewLayers
    kind: function
    at: 'apps/track-labeler/src/features/map/map-layers.hooks.ts:L80-L96'
  - symbol: useMapDeckLayers
    kind: function
    at: 'apps/track-labeler/src/features/map/map-layers.hooks.ts:L98-L108'
---

<!-- context:generated:start -->

## Summary

Abstracts Deck.GL layer creation for tracks, rulers, and contextual data layers. Hooks (useTrackLabelerDeckLayer, useMapRulerInstance, useMapDataviewLayers) encapsulate layer construction logic, applying visual styling (colors from legend, highlighting), temporal filtering, and memoization to prevent unnecessary GPU re-renders. Depends on Redux selectors and external layer libraries.

## Related

- uses [[ruler-drawing-tool]] — useMapRulerInstance creates RulersLayer from rulers.selectors state.
- uses [[timebar-ui-data-filtering]] — useTrackLabelerDeckLayer reads selectHighlightedTime to compute millisecond time windows for point highlighting.
- depends on [[vessel-track-data-loading-transformation]] — useTrackLabelerDeckLayer subscribes to selectDirectionPointsData and selectLegendLabels selectors derived from parsed tracks.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
