# apps/platform/features/_vessels/vessel/vessel-events.hooks.ts · [[map-layer-integration]] [[vessel-event-management]]

Provides React hooks for managing vessel profile event layers, loading states, errors, and syncing event data to the Redux store.

- useVesselProfileLayer · function · L13-L16 — Retrieves the vessel profile's deck layer instance from Redux state and composer API.
- useVesselProfileEvents · function · L18-L28 — Memoizes and returns vessel event data when event layers are loaded, recomputing only when data availability changes.
- useVesselProfileEventsLoading · function · L30-L33 — Checks whether the vessel profile's event layers are still loading or unavailable.
- useVesselProfileEventsError · function · L35-L38 — Retrieves any loading or processing error for the vessel's event layers.
- useSetVesselProfileEvents · function · L40-L49 — Dispatches loaded vessel events to Redux state whenever a valid vessel ID and event data are available.
