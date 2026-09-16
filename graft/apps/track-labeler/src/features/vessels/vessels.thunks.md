# apps/track-labeler/src/features/vessels/vessels.thunks.ts · [[track-labeler-vessel-metadata]]

Thunks module that provides async Redux actions for fetching and storing vessel information from the GFW API.

- fetchVesselInfo · function · L14-L24 — Fetches vessel metadata from the GFW API by vessel ID and returns the parsed VesselInfo object.
- vesselInfoThunk · function · L27-L52 — Redux thunk that conditionally fetches and dispatches vessel information only if not in import view, ID is valid, and cached data is stale.
