# apps/platform/features/_map/map/map-interactions.atoms.ts · [[map-interactions]]

Module that exports abortable in-flight map interaction request state and a hook to cancel them without pulling deck.gl runtime dependencies.

- InteractionPromise · type · L13-L13 — Type alias for abortable promises used to track and cancel pending map interaction requests.
- useCancelInteractionPromises · function · L29-L54 — Hook that provides a callback to abort all pending map interaction requests and reset them to initial state.
