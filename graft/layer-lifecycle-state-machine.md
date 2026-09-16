---
name: Layer Lifecycle State Machine
slug: layer-lifecycle-state-machine
type: concept
sources:
  - path: libs/deck-layer-composer/src/types.ts
    hash: 4609fe52feceff7fe968a82b22b5bd1af13b5fb0300a9cf1e7209057df708c79
sources_digest: 0bf933eaba2ff043c4cbadac3bd840df48a5d89b246b12d876e2d1f9ef409a0c
links: []
generator:
  version: 1
covers:
  - symbol: DeckLayerLifecycle
    kind: type
    at: 'libs/deck-layer-composer/src/types.ts:L19-L19'
  - symbol: LegendType
    kind: enum
    at: 'libs/deck-layer-composer/src/types.ts:L21-L27'
  - symbol: DeckLegend
    kind: type
    at: 'libs/deck-layer-composer/src/types.ts:L29-L44'
  - symbol: DeckLegendBivariate
    kind: interface
    at: 'libs/deck-layer-composer/src/types.ts:L46-L51'
---

<!-- context:generated:start -->

## Summary

DeckLayerLifecycle enum tracks layer state transitions from NO_STATE through matching and finalization stages, enabling predictable layer reuse and garbage collection for dynamically rendered layers.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
