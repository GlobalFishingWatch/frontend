# libs/deck-layer-composer/src/hooks/deck-layers-composer.hooks.ts · [[deck-layer-composition-rendering]]

- ResolvedDeckLayer · type · L16-L20 — Type definition for a resolved deck layer combining a unique id, layer class constructor, and its initialization properties.
- CachedDeckLayer · type · L21-L21 — Type definition for a cached deck layer storing the LayerClass, props, and the instantiated layer object to enable cache hit comparisons.
- useDeckLayerComposer · function · L23-L116 — Hook that transforms dataview configurations into cached deck layer instances, deduplicates by comparing class and props, and updates the shared atom only when the instance list meaningfully changes.
- useSetDeckLayerComposer · function · L118-L120 — Hook that exposes the Jotai setter for the deck layer instances atom, allowing direct updates to the shared layer state.
