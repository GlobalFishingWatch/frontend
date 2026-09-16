# apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts · [[concurrent-request-deduplication-retry-logic]] [[vessel-groups-management-system]]

Redux slice that manages vessel group state, including async thunks for fetching, creating, updating, and deleting vessel groups, with workspace-specific operations and memoized selectors.

- IdField · type · L19-L28 — Union type enumerating the valid vessel identifier fields used for vessel group queries.
- VesselGroupsState · interface · L30-L35 — Extends AsyncReducer to track vessel groups and workspace-specific loading/error state.
- VesselGroupSliceState · type · L44-L44 — Type alias wrapping the vessel groups state slice within the root Redux state.
- UpdateVesselGroupThunkParams · type · L137-L140 — Type defining required and optional parameters for updating vessel group with override and ID control.
- saveVesselGroup · function · L209-L239 — Nested async function that persists a vessel group and retries with a timestamped name suffix on duplicate-name conflicts.
- extraReducers · method · L279-L298 — Defines store state mutations for workspace vessel groups fetch lifecycle events (pending, fulfilled, rejected).
- selectVesselGroupsStatus · function · L317-L317 — Selector returning the async operation status of the vessel groups data fetch.
- selectVesselGroupsError · function · L318-L318 — Selector returning any API error encountered during vessel groups fetch operations.
- selectWorkspaceVesselGroupsStatus · function · L319-L320 — Selector returning the async status specific to workspace vessel groups fetching.
- selectWorkspaceVesselGroupsError · function · L322-L323 — Selector returning any API error from workspace vessel groups fetch operations.
- selectVesselGroupsStatusId · function · L324-L325 — Selector returning the status ID tracking vessel group state changes.
