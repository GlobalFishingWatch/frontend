---
name: Deck Layer Legends & Interaction
slug: deck-layer-legends-interaction
type: system
sources:
  - path: libs/deck-layer-composer/src/hooks/deck-layers-legends.hooks.ts
    hash: b55380316415b1f983135464dbd2f42b97334c98cd93ab0ba7fc01bc6930924a
  - path: libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts
    hash: f1d533ed70b2b9115b3312189c0111d7fe83b3dffa5037b2a3e22b716745fe84
  - path: libs/deck-layer-composer/src/interactions/deck-layers-interaction.hooks.ts
    hash: 21c3a3db191e8c23ac7690abccb3a8ea2b9cb3089aad1f45f0fa9cb3944f92bf
sources_digest: 0e248fed421d634b1e6d08af73c429329e934dc926088da4a674ccf4f3e59066
links:
  - to: deck-layer-composition-rendering
    relation: depends_on
    description: Subscribes to layer instances and loading state for legend derivation
generator:
  version: 1
covers:
  - symbol: DeckLegendAtom
    kind: type
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-legends.hooks.ts:L20-L20'
  - symbol: useDeckLegends
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-legends.hooks.ts:L98-L100'
  - symbol: useGetDeckLayerLegend
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-legends.hooks.ts:L102-L105'
  - symbol: useGetDeckLayerLegends
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-legends.hooks.ts:L107-L110'
  - symbol: DeckLayerLoaded
    kind: type
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L9-L17'
  - symbol: DeckLayerState
    kind: type
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L18-L18'
  - symbol: useDeckLayerLoadedState
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L21-L23'
  - symbol: getIsLayerLoaded
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L27-L33'
  - symbol: isDeckLayerReady
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L35-L41'
  - symbol: useSetDeckLayerLoadedState
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L43-L103'
  - symbol: useIsDeckLayersLoading
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L110-L112'
  - symbol: useDeckLayerLoaded
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L114-L120'
  - symbol: getLayersStateHashAtom
    kind: function
    at: 'libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts:L123-L133'
  - symbol: useMapHoverInteraction
    kind: function
    at: >-
      libs/deck-layer-composer/src/interactions/deck-layers-interaction.hooks.ts:L8-L10
  - symbol: useSetMapHoverInteraction
    kind: function
    at: >-
      libs/deck-layer-composer/src/interactions/deck-layers-interaction.hooks.ts:L12-L20
---

<!-- context:generated:start -->

## Summary

Generates color scale and symbol legends from layer instances, handles hover/click picking state, and provides query hooks for UI components. Transforms FourwingsLayer metadata into structured DeckLegendAtom objects with zoom-aware labels.

## Related

- depends on [[deck-layer-composition-rendering]] — Subscribes to layer instances and loading state for legend derivation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
