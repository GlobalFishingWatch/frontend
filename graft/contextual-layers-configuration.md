---
name: Contextual Layers Configuration
slug: contextual-layers-configuration
type: system
sources:
  - path: apps/track-labeler/src/features/map/map-layers.dataviews.ts
    hash: 6964988de3e6c45f0c8a1b031001e4e47b84f14415e42a95840c31a38bf372a1
  - path: apps/track-labeler/src/features/map/map-layers.selectors.ts
    hash: 215a09d8f15a047fcce9838b78e96c653ba9263eb51d540e43f10bcda155ded4
sources_digest: 1e4fc10d10834ae237e22bdf8dcad39972433645f8c6cd78faa4043382a5aaae
links:
  - to: deck-gl-layer-composition-system
    relation: part_of
    description: Dataviews feed into useMapDataviewLayers hook for Deck.GL rendering.
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Defines and manages static geographic reference layers (basemap, EEZ, MPA, RFMO zones) as hardcoded UrlDataviewInstance fixtures. The getContextualLayersDataviews selector merges visibility state (hidden layers from routes, satellite basemap mode) into dataview configs. These layers provide geographic context for vessel track visualization and are toggled via MapControls.

## Related

- part of [[deck-gl-layer-composition-system]] — Dataviews feed into useMapDataviewLayers hook for Deck.GL rendering.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
