---
name: Map Context
slug: map-context
type: file
sources:
  - path: apps/platform/features/_map/map/map-context.hooks.ts
    hash: 1cc16276314ad4d2b48c6072f1ec7d1ab9168806c5777203cd7e87086ec8c8a0
sources_digest: ad26ca035e065491748bba11715e8418245df27c3ccff3ffeb81943b7a477c2a
links:
  - to: map-rendering-core
    relation: implements
    description: Stores the Deck.GL instance for cross-component access
  - to: map-viewport-management
    relation: implements
    description: >-
      Provides the map instance needed for viewport unprojection and bounds
      calculations
generator:
  version: 1
covers:
  - symbol: mapInstanceAtomSelector
    kind: function
    at: 'apps/platform/features/_map/map/map-context.hooks.ts:L10-L10'
  - symbol: useSetMapInstance
    kind: function
    at: 'apps/platform/features/_map/map/map-context.hooks.ts:L13-L21'
  - symbol: useDeckMap
    kind: function
    at: 'apps/platform/features/_map/map/map-context.hooks.ts:L23-L25'
---

<!-- context:generated:start -->

## Summary

Jotai-based state management bridging Deck.GL's imperative ref API with declarative atom access. Provides useSetMapInstance to synchronize a Deck.GL ref into mapInstanceAtom and useDeckMap to read the stored instance for programmatic access.

## Related

- implements [[map-rendering-core]] — Stores the Deck.GL instance for cross-component access
- implements [[map-viewport-management]] — Provides the map instance needed for viewport unprojection and bounds calculations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
