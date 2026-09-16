# apps/platform/features/_vessels/vessel/vessel.slice.ts · [[dataset-management-integration]] [[vessel-redux-state-management]]

Redux slice managing vessel profile data fetching, caching, and UI state (event selection, print mode, voyage tracking).

- VesselDataIdentity · type · L46-L56 — Type representing a single vessel identity record with metadata about its source, gear types, and compliance status.
- IdentityVesselData · type · L58-L72 — Type representing the complete aggregated vessel profile data including all identities, datasets, and registry information.
- VesselInfoEntry · type · L74-L80 — Type representing the redux state entry for a single vessel, tracking load status, vessel data, events, and errors.
- VesselInfoState · type · L82-L82 — Type representing the collection of all cached vessel information entries indexed by vessel ID.
- VesselState · type · L84-L91 — Type representing the complete vessel redux slice state including UI flags, vessel data cache, and selected event/voyage context.
- VesselSliceState · type · L102-L102 — Type representing the root state shape containing the vessel slice.
- FetchVesselThunkParams · type · L104-L109 — Type defining parameters for the async thunk that fetches vessel profile data from the API.
- selectVesselSlice · function · L329-L329 — Selector that retrieves the entire vessel slice from root state.
- selectVesselEventId · function · L330-L330 — Selector that retrieves the currently selected event ID from vessel state.
- selectVesselEventType · function · L331-L331 — Selector that retrieves the currently selected event type from vessel state.
- selectVesselVoyage · function · L332-L332 — Selector that retrieves the currently selected voyage number from vessel state.
