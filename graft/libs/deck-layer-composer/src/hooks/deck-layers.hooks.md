# libs/deck-layer-composer/src/hooks/deck-layers.hooks.ts

React hooks module providing typed access to deck layer state and instances via Jotai atoms.

- DeckLayerAtom · type · L10-L15 — Represents a deck layer with its instance, load status, and readiness state.
- useDeckLayers · function · L28-L30 — Hook that retrieves the current list of all deck layers from the atom store.
- useGetDeckLayer · function · L32-L36 — Hook that returns a single deck layer by ID, or undefined if not ready.
- useGetDeckLayers · function · L38-L50 — Hook that retrieves multiple deck layers by IDs with memoization and deduplication.
