# apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts · [[map-layer-integration]] [[transmission-date-validation]] [[vessel-bounds-and-time-synchronization]]

Module exports custom React hooks that manage vessel track boundaries, timerange synchronization, and automatic map fitting for vessel profile views.

- useGetVesselProfileBbox · function · L23-L33 — Returns a callback that fetches the current vessel track bounding box from the map layer when tracks are fully loaded.
- useVesselProfileBounds · function · L35-L90 — Orchestrates fitting vessel track bounds to the map view and handles user confirmation when the timerange falls outside transmission dates.
- useVesselFitBoundsOnLoad · function · L92-L106 — Automatically fits the vessel track bounds to the map when the track finishes loading and the fit-bounds flag is set.
- useVesselFitTranmissionsBounds · function · L108-L153 — Updates the map timerange to match the vessel's transmission dates on initial load and fits track bounds after the timerange is updated.
- useVesselFitBounds · function · L155-L161 — Composite hook that orchestrates vessel bounds fitting for both standalone vessel pages and navigation from workspaces.
