---
name: Dynamic Layer Instantiation via Type Dispatch
slug: dynamic-layer-instantiation-via-type-dispatch
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/resolvers.ts
    hash: 9c70c44402782024823cd5a8f3bd91dbc78d6b2e6011ddc0d46ae032a6e7c14e
sources_digest: 7ed68657b878b20faf2b800918c52268d9675b3ccc98ed32aa0cc1b007ac78f3
links:
  - to: deck-layers-library
    relation: produces
    description: >-
      Instantiates layer classes with resolved props from the dispatched
      resolver
  - to: type-specific-layer-resolvers
    relation: uses
    description: Dispatch logic selects the correct resolver based on dataview type
generator:
  version: 1
covers:
  - symbol: DeckLayerClass
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L48-L48'
  - symbol: DeckLayerResolved
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L52-L55'
  - symbol: dataviewToDeckLayerResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L57-L167'
  - symbol: dataviewToDeckLayer
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L169-L175'
---

<!-- context:generated:start -->

## Summary

The resolver system uses cascading if-statement dispatch on DataviewType to route each dataview to its appropriate resolver and layer class, with type narrowing for specialized instances like ResolvedFourwingsDataviewInstance.

## Related

- produces [[deck-layers-library]] — Instantiates layer classes with resolved props from the dispatched resolver
- uses [[type-specific-layer-resolvers]] — Dispatch logic selects the correct resolver based on dataview type

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
