---
name: Type System & Contracts
slug: type-system-contracts
type: concept
sources:
  - path: libs/datasets-client/src/types.ts
    hash: 396c6710279922d0b2520c9fd1ed54afe29e49c190bd33f8ea54c91864dc617a
  - path: libs/dataviews-client/src/types.ts
    hash: 2c427a610ec464b1a9ea34b90358e16d4e96c596419fd1d1c3a9fed47ecf8887
  - path: libs/deck-layer-composer/src/interactions/types.ts
    hash: 46542b3fd77e1d2288e11527b4d94c8f00be7d5275ffcf091fb4338c66639279
sources_digest: 5914b45cb29ed47b0d38569cb5608bd7ac40a8e0bc1668bb014e944c23e9c0cd
links:
  - to: dataview-resolution-filtering
    relation: implements
    description: Type definitions define contracts for resolver function inputs/outputs
generator:
  version: 1
covers:
  - symbol: UrlDataviewInstance
    kind: type
    at: 'libs/datasets-client/src/types.ts:L4-L7'
  - symbol: UrlDataviewInstance
    kind: type
    at: 'libs/dataviews-client/src/types.ts:L3-L6'
  - symbol: AnyDataviewInstance
    kind: type
    at: 'libs/dataviews-client/src/types.ts:L8-L8'
  - symbol: InteractionEventType
    kind: type
    at: 'libs/deck-layer-composer/src/interactions/types.ts:L5-L5'
  - symbol: InteractionEvent
    kind: type
    at: 'libs/deck-layer-composer/src/interactions/types.ts:L6-L13'
---

<!-- context:generated:start -->

## Summary

Defines TypeScript interfaces for dataview instances (UrlDataviewInstance), interaction events (InteractionEvent), layer configurations (DeckLegendAtom), and resource metadata. Relaxes API contract strictness where needed for URL-loaded state and establishes extension points via optional callbacks.

## Related

- implements [[dataview-resolution-filtering]] — Type definitions define contracts for resolver function inputs/outputs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
