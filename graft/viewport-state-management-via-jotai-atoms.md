---
name: Viewport State Management via Jotai Atoms
slug: viewport-state-management-via-jotai-atoms
type: concept
sources:
  - path: apps/track-labeler/src/features/map/map.hooks.ts
    hash: 146ba12003ea3213d3b76912cbb5b0468b45829c589f7b55b316106d499a4d8e
sources_digest: d55ef918e33e057cd429989adb5b77406e1ed1d6002e2b68b723b157604a2be2
links:
  - to: map-rendering-visualization-layer
    relation: implements
    description: >-
      Map component calls useSetMapInstance to store Deck reference;
      sidebar/timebar use useMapSetViewState to pan/zoom.
generator:
  version: 1
covers:
  - symbol: useMapHover
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L21-L44'
  - symbol: useMapClick
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L46-L78'
  - symbol: LatLon
    kind: type
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L80-L83'
  - symbol: HighlightedTime
    kind: type
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L84-L84'
  - symbol: useMapViewState
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L92-L94'
  - symbol: useMapSetViewState
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L95-L104'
  - symbol: useHiddenLabelsConnect
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L106-L123'
  - symbol: dispatchHiddenLabels
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L110-L120'
  - symbol: useSetMapInstance
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L127-L134'
  - symbol: useDeckMap
    kind: function
    at: 'apps/track-labeler/src/features/map/map.hooks.ts:L136-L138'
---

<!-- context:generated:start -->

## Summary

Map viewport coordinates (bounds, pitch, bearing) and the Deck.GL instance are stored in Jotai atoms rather than Redux, decoupling them from the main store to avoid global state pollution and enable efficient throttling. useMapViewState reads/writes viewport via atom.get(), useMapSetViewState returns a setState callback, useSetMapInstance/useDeckMap expose the Deck instance. A critical constraint: useDeckMap casts to Deck without null-safety, risking runtime errors if called before useSetMapInstance initializes the atom.

## Related

- implements [[map-rendering-visualization-layer]] — Map component calls useSetMapInstance to store Deck reference; sidebar/timebar use useMapSetViewState to pan/zoom.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
