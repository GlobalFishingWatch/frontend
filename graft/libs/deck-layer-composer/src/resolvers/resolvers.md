# libs/deck-layer-composer/src/resolvers/resolvers.ts · [[api-type-system]] [[deck-layer-composition-system]] [[dynamic-layer-instantiation-via-type-dispatch]] [[polymorphic-input-handling]]

Resolver module that maps dataview configurations to deck layer classes and their props, with functions to instantiate the appropriate layer type based on dataview type.

- DeckLayerClass · type · L48-L48 — Type alias for a constructor that creates deck layer instances with arbitrary configuration properties.
- DeckLayerResolved · type · L52-L55 — Data structure holding a resolved deck layer class and its props, enabling deferred instantiation to avoid unnecessary layer recreation.
- dataviewToDeckLayerResolved · function · L57-L167 — Resolves a dataview configuration to its corresponding deck layer class and computed props by dispatching on dataview type.
- dataviewToDeckLayer · function · L169-L175 — Instantiates a deck layer by resolving its class and props, then constructing the layer with those props.
