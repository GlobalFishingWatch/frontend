---
name: Layer Composition & Deck Integration
slug: layer-composition-deck-integration
type: system
sources:
  - path: apps/platform/features/_map/map/Map.tsx
    hash: 93aa9cd7497342a3dc947314a534350d2fe2df313f6e432e86b552fdb3d31b3b
sources_digest: 3a43c762ffb2670bc2a564102ded8f2b6a567c549a88cd22d5beccc17b40496b
links:
  - to: annotation-system
    relation: depends_on
    description: >-
      Composition integrates annotation overlay rendering alongside layer
      composition
  - to: drawing-coordinate-system
    relation: depends_on
    description: >-
      Conditionally renders drawing UI and coordinate edit overlays based on
      drawing state
  - to: highlight-synchronization
    relation: uses
    description: >-
      Provides deckLayerInstancesAtom that highlight sync consumes to update
      layers
  - to: map-interaction-feature-picking
    relation: produces
    description: Generates picking objects from deck.gl layer interactions
generator:
  version: 1
covers:
  - symbol: MapWrapper
    kind: function
    at: 'apps/platform/features/_map/map/Map.tsx:L37-L103'
---

<!-- context:generated:start -->

## Summary

Manages lifecycle and composition of deck.gl layers for interactive map rendering. Exposes deckLayerInstancesAtom and layer lifecycle hooks consumed by highlight synchronization. Coordinates with layer-picking integration and manages layer state transitions across feature navigation (workspace/report/vessel views).

## Related

- depends on [[annotation-system]] — Composition integrates annotation overlay rendering alongside layer composition
- depends on [[drawing-coordinate-system]] — Conditionally renders drawing UI and coordinate edit overlays based on drawing state
- uses [[highlight-synchronization]] — Provides deckLayerInstancesAtom that highlight sync consumes to update layers
- produces [[map-interaction-feature-picking]] — Generates picking objects from deck.gl layer interactions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
