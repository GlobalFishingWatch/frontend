# libs/deck-layer-composer/src/hooks/deck-layers-state.hooks.ts · [[deck-layer-legends-interaction]]

Provides React hooks and Jotai atoms to manage and track the loading state, readiness, and cache state of deck layers across the application.

- DeckLayerLoaded · type · L9-L17 — Tracks the loaded, ready, and cache state of an individual deck layer instance.
- DeckLayerState · type · L18-L18 — Maps layer IDs to their corresponding loading and readiness metadata.
- useDeckLayerLoadedState · function · L21-L23 — Provides read-only access to the global atom storing all layer loading state.
- getIsLayerLoaded · function · L27-L33 — Safely extracts the isLoaded property from a layer, returning a fallback if the layer has been garbage collected.
- isDeckLayerReady · function · L35-L41 — Determines whether a layer is in a usable state based on its lifecycle stage.
- useSetDeckLayerLoadedState · function · L43-L103 — Updates the global layer state atom on the next animation frame, batching updates and detecting changes via cache hashes.
- useIsDeckLayersLoading · function · L110-L112 — Provides read-only access to a derived atom that indicates whether any deck layer is currently unloaded.
- useDeckLayerLoaded · function · L114-L120 — Returns the loaded state of a specific layer by ID, with a memoized atom per layer to optimize re-renders.
- getLayersStateHashAtom · function · L123-L133 — Creates a derived atom that produces a hash string representing the combined load and cache state of multiple layers for change detection.
